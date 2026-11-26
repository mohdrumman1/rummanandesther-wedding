import { useCallback, useEffect, useRef, useState } from 'react'

// Presigned URLs last 1h; refetch the list if it is older than this before downloading.
export const STALE_AFTER = 50 * 60 * 1000
const GAP_MS = 600

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

function clickDownload(item) {
  if (!item.originalUrl) throw new Error('No link')
  const a = document.createElement('a')
  a.href = item.originalUrl
  a.download = item.filename || ''
  a.rel = 'noopener'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  a.remove()
}

// Sequential downloads (no zip, low memory). state: null | { done, total, failed, running, cancelled }
export function useDownloader() {
  const [state, setState] = useState(null)
  const cancelRef = useRef(false)
  const busyRef = useRef(false)

  useEffect(() => () => { cancelRef.current = true }, [])

  const run = useCallback(async items => {
    if (busyRef.current || !items.length) return
    busyRef.current = true
    cancelRef.current = false
    let failed = 0
    let done = 0
    setState({ done: 0, total: items.length, failed: 0, running: true, cancelled: false })
    for (const item of items) {
      if (cancelRef.current) break
      try {
        clickDownload(item)
      } catch {
        failed += 1
      }
      done += 1
      setState({ done, total: items.length, failed, running: true, cancelled: false })
      await sleep(GAP_MS)
    }
    busyRef.current = false
    setState({ done, total: items.length, failed, running: false, cancelled: cancelRef.current && done < items.length })
  }, [])

  const cancel = useCallback(() => { cancelRef.current = true }, [])
  const dismiss = useCallback(() => setState(null), [])
  return { state, run, cancel, dismiss, busy: Boolean(state?.running) }
}

export function downloadLabel(state) {
  if (!state) return ''
  if (state.running) return `Downloading ${Math.min(state.done + 1, state.total)} of ${state.total}`
  const ok = state.done - state.failed
  return `${state.cancelled ? 'Cancelled. ' : ''}${ok} downloaded, ${state.failed} failed`
}

export const DOWNLOAD_HINT = 'Your browser may ask to allow multiple downloads — tap Allow.'
