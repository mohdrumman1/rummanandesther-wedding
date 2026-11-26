import { RSVP_API_BASE_URL, getAdminToken } from './rsvpApi'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function call(path, { identity, admin, method = 'GET', body, signal } = {}) {
  const headers = {}
  if (body !== undefined) headers['content-type'] = 'application/json'
  if (identity) {
    headers['x-upload-code'] = identity.code || ''
    headers['x-device-id'] = identity.deviceId || ''
    // Header values must be Latin-1; encode so any name (e.g. accents, emoji) is safe.
    if (identity.name) headers['x-uploader-name'] = encodeURIComponent(identity.name)
  }
  if (admin) {
    const token = getAdminToken()
    if (token) headers.authorization = `Bearer ${token}`
  }
  const res = await fetch(`${RSVP_API_BASE_URL}${path}`, {
    method,
    headers,
    signal,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const isJson = (res.headers.get('content-type') || '').includes('application/json')
  const data = isJson ? await res.json() : await res.text()
  if (!res.ok) {
    throw new ApiError(typeof data === 'object' && data?.error ? data.error : 'Something went wrong.', res.status)
  }
  return data
}

const enc = encodeURIComponent
const fileBody = f => ({ filename: f.name, type: f.type || 'application/octet-stream', size: f.size })

export const createSingle = (identity, file, signal) =>
  call('/api/uploads/single', { identity, method: 'POST', body: fileBody(file), signal })

export const createMultipart = (identity, file, signal) =>
  call('/api/uploads/multipart', { identity, method: 'POST', body: fileBody(file), signal })

export const signPart = (identity, { uploadId, key, partNumber }, signal) =>
  call(`/api/uploads/multipart/${enc(uploadId)}/${partNumber}?key=${enc(key)}`, { identity, signal })

export const listParts = (identity, { uploadId, key }, signal) =>
  call(`/api/uploads/multipart/${enc(uploadId)}?key=${enc(key)}`, { identity, signal })

export const completeMultipart = (identity, { uploadId, key, parts }, signal) =>
  call(`/api/uploads/multipart/${enc(uploadId)}/complete`, {
    identity,
    method: 'POST',
    body: { key, parts: parts.map(p => ({ PartNumber: p.PartNumber, ETag: p.ETag })) },
    signal,
  })

export const abortMultipart = (identity, { uploadId, key }, signal) =>
  call(`/api/uploads/multipart/${enc(uploadId)}?key=${enc(key)}`, { identity, method: 'DELETE', signal })

export const markDone = (identity, id, thumbBase64) =>
  call(`/api/uploads/${enc(id)}/done`, {
    identity,
    method: 'POST',
    body: thumbBase64 ? { thumbBase64 } : {},
  })

export const fetchAdminMedia = ({ cursor, uploader } = {}) => {
  const qs = new URLSearchParams()
  if (cursor) qs.set('cursor', cursor)
  if (uploader) qs.set('uploader', uploader)
  const q = qs.toString()
  return call(`/api/admin/media${q ? `?${q}` : ''}`, { admin: true })
}

export const deleteAdminMedia = id => call(`/api/admin/media/${enc(id)}`, { admin: true, method: 'DELETE' })

export const fetchMyUploads = ({ identity, cursor, signal } = {}) =>
  call(`/api/gallery${cursor ? `?cursor=${enc(cursor)}` : ''}`, { identity, signal })
