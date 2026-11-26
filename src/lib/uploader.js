// Headless upload engine. Lives outside React: Uppy does the work, a tiny
// store publishes throttled snapshots that the UI reads via useSyncExternalStore.
import Uppy from '@uppy/core'
import AwsS3 from '@uppy/aws-s3'
import * as api from './uploadsApi'

const STORE_KEY = 'wedding_share_v1'
const MB = 1024 * 1024
const MULTIPART_MIN = 50 * MB
const CHUNK = 8 * MB
const UI_INTERVAL = 250
const THUMB_MAX = 400
const THUMB_MAX_BYTES = 200 * 1024
// Backoff 1s..30s inside Uppy; our own loop below retries up to MAX_RETRIES, then the
// file is marked failed (the Retry button still works).
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000, 30000, 30000]
const MAX_RETRIES = 20
const backoff = n => Math.min(1000 * 2 ** n, 30000)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
// Server rate-limits/overload: wait and try again without spending the retry budget.
const THROTTLED = new Set([429, 503])

// v4 UUID; randomUUID is missing on older browsers / non-secure contexts.
function randomId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  const b = globalThis.crypto.getRandomValues(new Uint8Array(16))
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = Array.from(b, x => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}

function loadStored() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

function saveStored(patch) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ ...loadStored(), ...patch }))
  } catch { /* private mode */ }
}

export function getStoredIdentity() {
  const s = loadStored()
  let deviceId = s.deviceId
  if (!deviceId || !UUID_RE.test(deviceId)) {
    deviceId = randomId()
    saveStored({ deviceId })
  }
  return { code: s.code || '', name: s.name || '', deviceId }
}

function concurrency() {
  const c = navigator.connection
  if (c && (c.saveData || ['slow-2g', '2g', '3g'].includes(c.effectiveType))) return 2
  return 3
}

// ---- thumbnails -----------------------------------------------------------

function canvasToJpeg(canvas) {
  return new Promise(resolve => {
    const attempt = q => canvas.toBlob(b => {
      if (!b) return resolve(null)
      if (b.size > THUMB_MAX_BYTES && q > 0.4) return attempt(q - 0.2)
      resolve(b.size <= THUMB_MAX_BYTES ? b : null)
    }, 'image/jpeg', q)
    attempt(0.75)
  })
}

function drawScaled(source, w, h) {
  const scale = Math.min(1, THUMB_MAX / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(w * scale))
  canvas.height = Math.max(1, Math.round(h * scale))
  canvas.getContext('2d').drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvasToJpeg(canvas)
}

async function imageThumb(file) {
  const bmp = await createImageBitmap(file)
  try {
    return await drawScaled(bmp, bmp.width, bmp.height)
  } finally {
    bmp.close?.()
  }
}

function videoThumb(file) {
  return new Promise(resolve => {
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    let settled = false
    const finish = async ok => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      let blob = null
      if (ok && video.videoWidth) {
        try { blob = await drawScaled(video, video.videoWidth, video.videoHeight) } catch { /* no thumb */ }
      }
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(url)
      resolve(blob)
    }
    const timer = setTimeout(() => finish(false), 8000)
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.onerror = () => finish(false)
    video.onloadedmetadata = () => {
      const d = Number.isFinite(video.duration) ? video.duration : 0.5
      video.currentTime = Math.min(0.5, d / 2)
    }
    video.onseeked = () => finish(true)
    video.src = url
  })
}

async function makeThumb(file) {
  try {
    if (file.type.startsWith('video/')) return await videoThumb(file)
    return await imageThumb(file)
  } catch {
    return null
  }
}

function blobToBase64(blob) {
  return new Promise(resolve => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1] || null)
    r.onerror = () => resolve(null)
    r.readAsDataURL(blob)
  })
}

// ---- engine ---------------------------------------------------------------

class Uploader {
  constructor() {
    this.identity = getStoredIdentity()
    this.rows = new Map() // uppy file id -> row shown in UI
    this.serverIds = new Map() // uppy file id -> backend upload id
    this.thumbs = new Map() // uppy file id -> Promise<base64|null>
    this.uploadedOk = new Set() // bytes are in storage; only `done` call left
    this.retryCounts = new Map()
    this.retryTimers = new Map()
    this.thumbQueue = Promise.resolve()
    this.listeners = new Set()
    this.timer = null
    this.fatal = ''
    this.online = typeof navigator === 'undefined' ? true : navigator.onLine
    this.wakeLock = null
    this.snapshot = this.#build()

    const id = () => this.identity
    this.uppy = new Uppy({ autoProceed: true, allowMultipleUploadBatches: true })
    this.uppy.use(AwsS3, {
      limit: concurrency(),
      retryDelays: RETRY_DELAYS,
      allowedMetaFields: [],
      getChunkSize: () => CHUNK,
      shouldUseMultipart: f => f.size >= MULTIPART_MIN,
      getUploadParameters: async (file, { signal }) => {
        const r = await api.createSingle(id(), file, signal)
        this.serverIds.set(file.id, r.id)
        return { method: 'PUT', url: r.url, headers: { 'Content-Type': file.type || 'application/octet-stream' } }
      },
      createMultipartUpload: async file => {
        const r = await api.createMultipart(id(), file)
        this.serverIds.set(file.id, r.id)
        return { uploadId: r.uploadId, key: r.key }
      },
      signPart: async (_file, { uploadId, key, partNumber, signal }) => {
        const r = await api.signPart(id(), { uploadId, key, partNumber }, signal)
        return { url: r.url }
      },
      listParts: async (_file, { uploadId, key, signal }) => (await api.listParts(id(), { uploadId, key }, signal)).parts || [],
      completeMultipartUpload: async (_file, { uploadId, key, parts, signal }) =>
        api.completeMultipart(id(), { uploadId, key, parts }, signal),
      abortMultipartUpload: async (_file, { uploadId, key, signal }) => {
        await api.abortMultipart(id(), { uploadId, key }, signal)
      },
    })

    this.uppy.on('upload-start', files => files.forEach(f => this.#patch(f.id, { status: 'uploading' })))
    this.uppy.on('upload-progress', (file, p) => {
      if (!file || !p?.bytesTotal) return
      this.#patch(file.id, { progress: Math.min(1, p.bytesUploaded / p.bytesTotal), status: 'uploading' })
    })
    this.uppy.on('upload-success', file => {
      this.uploadedOk.add(file.id)
      this.#finalize(file.id)
    })
    this.uppy.on('upload-error', (file, err) => {
      if (!file) return
      // 403 = bad code, 410 = uploads closed; anything else (404, 5xx...) is a per-file error.
      if (err?.status === 403 || err?.status === 410) {
        this.#stopAll(err.status === 410 ? 'closed' : 'code')
        return
      }
      this.#scheduleRetry(file.id, err?.status)
    })

    if (typeof window !== 'undefined') {
      window.addEventListener('offline', () => {
        this.online = false
        this.uppy.pauseAll()
        this.rows.forEach((r, k) => {
          if (r.status === 'uploading') this.#patch(k, { status: 'retrying' })
        })
        this.#emit()
      })
      window.addEventListener('online', () => {
        this.online = true
        this.uppy.resumeAll()
        this.rows.forEach((r, k) => {
          if (r.status === 'failed' || r.status === 'retrying') this.retry(k)
        })
        this.#emit()
      })
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.#syncWakeLock()
      })
      window.addEventListener('beforeunload', e => {
        if (this.snapshot.active > 0) {
          e.preventDefault()
          e.returnValue = ''
        }
      })
    }
  }

  // -- store API --
  subscribe = fn => {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  getSnapshot = () => this.snapshot

  setIdentity(patch) {
    this.identity = { ...this.identity, ...patch }
    saveStored({ code: this.identity.code, name: this.identity.name })
    if (patch.code) this.fatal = ''
    this.#emit()
  }

  addFiles(fileList) {
    if (!this.identity.code) return
    this.fatal = ''
    for (const file of Array.from(fileList)) {
      let id
      try {
        id = this.uppy.addFile({ name: file.name, type: file.type || '', data: file, source: 'Local' })
      } catch {
        continue // duplicate or unreadable
      }
      this.rows.set(id, {
        id,
        name: file.name,
        size: file.size,
        isVideo: file.type.startsWith('video/'),
        progress: 0,
        status: 'queued',
        thumbUrl: '',
      })
      this.#makeThumb(id, file)
    }
    this.#emit()
  }

  // Manual retry (Retry button / back online): resets the automatic attempt budget.
  retry = id => {
    this.retryCounts.delete(id)
    this.#retryNow(id)
  }

  #retryNow(id) {
    clearTimeout(this.retryTimers.get(id))
    this.retryTimers.delete(id)
    this.fatal = ''
    this.#patch(id, { status: 'queued' })
    if (this.uploadedOk.has(id)) this.#finalize(id)
    else this.uppy.retryUpload(id).catch(() => this.#scheduleRetry(id))
  }

  // -- internals --
  #stopAll(reason) {
    this.fatal = reason
    this.uppy.cancelAll()
    this.rows.forEach((_, k) => this.#patch(k, { status: 'failed' }))
  }

  #makeThumb(id, file) {
    const p = this.thumbQueue.then(async () => {
      const blob = await makeThumb(file)
      if (blob) this.#patch(id, { thumbUrl: URL.createObjectURL(blob) })
      return blob ? blobToBase64(blob) : null
    })
    this.thumbQueue = p.catch(() => {})
    this.thumbs.set(id, p.catch(() => null))
  }

  #scheduleRetry(id, status) {
    const n = this.retryCounts.get(id) || 0
    if (THROTTLED.has(status)) {
      // Jitter spreads a venue full of phones so they don't all retry in the same second.
      this.#patch(id, { status: 'retrying' })
      this.#armRetry(id, Math.max(5000, backoff(n)) + Math.random() * 5000)
      return
    }
    if (n >= MAX_RETRIES) {
      clearTimeout(this.retryTimers.get(id))
      this.retryTimers.delete(id)
      this.#patch(id, { status: 'failed' })
      return
    }
    this.retryCounts.set(id, n + 1)
    this.#patch(id, { status: 'retrying' })
    this.#armRetry(id, backoff(n))
  }

  // Waiting while offline or on a code error does not spend attempts.
  #armRetry(id, delay) {
    clearTimeout(this.retryTimers.get(id))
    this.retryTimers.set(id, setTimeout(() => {
      if (this.online && !this.fatal) this.#retryNow(id)
      else this.#armRetry(id, 30000)
    }, delay))
  }

  async #finalize(id) {
    const serverId = this.serverIds.get(id)
    try {
      const thumb = await Promise.race([this.thumbs.get(id), new Promise(r => setTimeout(() => r(null), 10000))])
      await api.markDone(this.identity, serverId, thumb)
      this.retryCounts.delete(id)
      this.#patch(id, { status: 'done', progress: 1 })
    } catch (err) {
      if (err?.status === 403) {
        this.fatal = 'code'
        this.#patch(id, { status: 'failed' })
      } else if (err?.status === 410) {
        this.fatal = 'closed'
        this.#patch(id, { status: 'failed' })
      } else {
        this.#scheduleRetry(id, err?.status)
      }
    }
  }

  #patch(id, patch) {
    const row = this.rows.get(id)
    if (!row) return
    Object.assign(row, patch)
    this.#emit()
  }

  #emit() {
    if (this.timer) return
    this.timer = setTimeout(() => {
      this.timer = null
      this.snapshot = this.#build()
      this.#syncWakeLock()
      this.listeners.forEach(fn => fn())
    }, UI_INTERVAL)
  }

  #build() {
    const items = Array.from(this.rows.values(), r => ({ ...r }))
    const done = items.filter(i => i.status === 'done').length
    const failed = items.filter(i => i.status === 'failed').length
    return {
      items,
      total: items.length,
      done,
      failed,
      active: items.length - done - failed,
      fatal: this.fatal,
      online: this.online,
      identity: this.identity,
    }
  }

  async #syncWakeLock() {
    try {
      if (!('wakeLock' in navigator)) return
      if (this.snapshot.active > 0 && document.visibilityState === 'visible') {
        if (!this.wakeLock) {
          this.wakeLock = await navigator.wakeLock.request('screen')
          this.wakeLock.addEventListener('release', () => { this.wakeLock = null })
        }
      } else if (this.wakeLock) {
        await this.wakeLock.release()
        this.wakeLock = null
      }
    } catch { /* not allowed (low battery etc.) */ }
  }
}

let instance
export function getUploader() {
  if (!instance) instance = new Uploader()
  return instance
}
