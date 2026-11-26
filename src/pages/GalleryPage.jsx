import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchMyUploads } from '../lib/uploadsApi'
import { getStoredIdentity } from '../lib/uploader'
import { DOWNLOAD_HINT, STALE_AFTER, downloadLabel, useDownloader } from '../lib/downloads'

const backLink =
  'mb-6 ml-2 inline-block font-sans sm:ml-0 text-[10px] uppercase tracking-ultra text-ink/45 transition-colors duration-200 hover:text-gold-dark'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const actionBtn =
  'border border-burgundy px-4 py-3 font-sans text-[10px] uppercase tracking-ultra text-burgundy hover:bg-burgundy hover:text-white disabled:opacity-50'

const isVideo = item => (item.content_type || '').startsWith('video/')
// Presigned URLs last 1h; after a load error refetch at most this often.
const REFRESH_COOLDOWN = 10 * 60 * 1000

function Lightbox({ item, onClose, onMediaError }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-3" onClick={e => e.stopPropagation()}>
        <a
          href={item.originalUrl}
          download
          className="border border-white/60 px-4 py-2 font-sans text-[10px] uppercase tracking-ultra text-white"
        >
          Download
        </a>
        <button type="button" onClick={onClose} aria-label="Close" className="px-3 py-2 text-2xl leading-none text-white">
          ×
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center p-3">
        {isVideo(item) ? (
          <video controls autoPlay playsInline src={item.inlineUrl} onError={onMediaError} onClick={e => e.stopPropagation()} className="max-h-full max-w-full" />
        ) : (
          <img
            src={item.inlineUrl || item.thumbUrl}
            alt={item.filename}
            onError={onMediaError}
            onClick={e => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [params] = useSearchParams()
  const urlCode = (params.get('c') || '').trim()
  const identity = useMemo(() => {
    const id = getStoredIdentity()
    return { ...id, code: urlCode || id.code, name: '' }
  }, [urlCode])
  const code = identity.code
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [badCode, setBadCode] = useState(false)
  const [open, setOpen] = useState(null)
  const [selected, setSelected] = useState(() => new Set())
  const [listing, setListing] = useState(null) // null | number of items fetched so far
  const fetchedAt = useRef(0)
  const dl = useDownloader()

  const toggle = id =>
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Follow nextCursor until done; returns the fresh full list.
  const loadAll = useCallback(async () => {
    setListing(0)
    setError('')
    try {
      let all = []
      let next = null
      do {
        const data = await fetchMyUploads({ identity, cursor: next })
        all = all.concat(data.items)
        next = data.nextCursor
        setListing(all.length)
      } while (next)
      setItems(all)
      setCursor(null)
      fetchedAt.current = Date.now()
      return all
    } catch (err) {
      setError(err.message || 'Could not load the gallery.')
      return null
    } finally {
      setListing(null)
    }
  }, [identity])

  const selectAll = async () => {
    const all = await loadAll()
    if (all) setSelected(new Set(all.map(i => i.id)))
  }
  const downloadAll = async () => {
    const all = await loadAll()
    if (all) dl.run(all)
  }
  const downloadSelected = async () => {
    let list = items
    if (Date.now() - fetchedAt.current > STALE_AFTER) list = (await loadAll()) || []
    dl.run(list.filter(i => selected.has(i.id)))
  }

  const load = useCallback(
    async (nextCursor, replace) => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchMyUploads({ identity, cursor: nextCursor })
        setItems(prev => (replace ? data.items : [...prev, ...data.items]))
        if (replace) fetchedAt.current = Date.now()
        setCursor(data.nextCursor)
      } catch (err) {
        if (err.status === 403) setBadCode(true)
        else setError(err.message || 'Could not load the gallery.')
      } finally {
        setLoading(false)
      }
    },
    [identity],
  )

  useEffect(() => {
    if (code) load(null, true) // eslint-disable-line react-hooks/set-state-in-effect
  }, [code, load])

  // A tile failed to load (usually expired links): refetch the pages already shown, once per cooldown.
  const refreshedAt = useRef(0)
  const refresh = useCallback(async () => {
    if (Date.now() - refreshedAt.current < REFRESH_COOLDOWN) return
    refreshedAt.current = Date.now()
    try {
      let fresh = []
      let next = null
      do {
        const data = await fetchMyUploads({ identity, cursor: next })
        fresh = fresh.concat(data.items)
        next = data.nextCursor
      } while (next && fresh.length < items.length)
      setItems(fresh)
      setCursor(next)
      fetchedAt.current = Date.now()
      setOpen(prev => (prev ? fresh.find(i => i.id === prev.id) || prev : prev))
    } catch { /* keep what we have */ }
  }, [identity, items.length])

  const busy = listing !== null || dl.busy
  const closeLightbox = useCallback(() => setOpen(null), [])
  const empty = useMemo(() => !loading && !error && items.length === 0, [loading, error, items])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className={`min-h-screen bg-cream ${selected.size > 0 ? 'pb-24' : ''}`}>
      <PageHeader title="My Uploads" subtitle="Only shows uploads made from this browser. Anything you shared from another phone or app is safe with Rumman & Esther." />
      <section className="mx-auto max-w-3xl px-3 py-8 sm:px-5 sm:py-12">
        <Link to="/seating" className={backLink}>
          ← Back to Find Your Seat
        </Link>
        {!code || badCode ? (
          <div className="mx-auto max-w-xl border border-gold/25 bg-white p-8 text-center">
            <span className="text-2xl text-gold">◆</span>
            <h2 className="mt-4 font-serif text-3xl font-light text-ink">We can't find your link</h2>
            <p className="mt-3 font-sans text-[14px] font-light leading-6 text-ink/60">
              {code
                ? 'That link doesn’t look right. Please scan the QR code again, or ask Rumman & Esther for a fresh link.'
                : 'Please open this page from the QR code or link we shared with you.'}
            </p>
          </div>
        ) : (
          <>
            {items.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <button type="button" disabled={busy} onClick={selected.size && selected.size === items.length && !cursor ? () => setSelected(new Set()) : selectAll} className={actionBtn}>
                    {selected.size && selected.size === items.length && !cursor ? 'Deselect all' : 'Select all'}
                  </button>
                  <button type="button" disabled={busy} onClick={downloadAll} className={`${actionBtn} bg-burgundy text-white hover:bg-burgundy-dark`}>
                    Download all
                  </button>
                </div>
                <p className="mt-2 font-sans text-[11px] font-light text-ink/50">{DOWNLOAD_HINT}</p>
                {listing !== null && <p className="mt-2 font-sans text-[12px] uppercase tracking-ultra text-ink/60">Loading… {listing}</p>}
                {dl.state && (
                  <p className="mt-2 flex items-center gap-3 font-sans text-[12px] text-ink/70">
                    <span>{downloadLabel(dl.state)}</span>
                    {dl.state.running ? (
                      <button type="button" onClick={dl.cancel} className="uppercase tracking-ultra text-burgundy underline">Cancel</button>
                    ) : (
                      <button type="button" onClick={dl.dismiss} className="uppercase tracking-ultra text-ink/50 underline">Dismiss</button>
                    )}
                  </p>
                )}
              </div>
            )}
            <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-2">
              {items.map(item => {
                const on = selected.has(item.id)
                return (
                  <div key={item.id} className={`relative aspect-square overflow-hidden bg-white ${on ? 'ring-2 ring-inset ring-burgundy' : ''}`}>
                    <button type="button" onClick={() => setOpen(item)} className="absolute inset-0" aria-label={`Open ${item.filename}`}>
                      {item.thumbUrl ? (
                        <img src={item.thumbUrl} alt="" loading="lazy" decoding="async" onError={refresh} className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-3xl text-gold/60">{isVideo(item) ? '' : '◆'}</span>
                      )}
                      {isVideo(item) && (
                        <span className="absolute inset-0 flex items-center justify-center text-3xl text-white drop-shadow" aria-hidden="true">▶</span>
                      )}
                    </button>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      aria-label={`Select ${item.filename}`}
                      onClick={() => toggle(item.id)}
                      className="absolute left-0 top-0 flex h-11 w-11 items-start justify-start p-1.5"
                    >
                      <span className={`flex h-6 w-6 items-center justify-center border-2 text-[14px] leading-none shadow ${on ? 'border-burgundy bg-burgundy text-white' : 'border-white bg-black/30 text-transparent'}`}>✓</span>
                    </button>
                  </div>
                )
              })}
            </div>

            {error && <p className="mt-4 text-center font-sans text-[13px] text-burgundy">{error}</p>}
            {empty && <p className="mt-6 text-center font-sans text-[14px] font-light text-ink/50">Nothing here yet. Photos and videos you share from this browser will appear here, and anything you shared from another phone or app is safe with Rumman &amp; Esther.</p>}
            {loading && <p className="mt-6 text-center font-sans text-[12px] uppercase tracking-ultra text-ink/45">Loading…</p>}
            {cursor && !loading && (
              <button
                type="button"
                onClick={() => load(cursor, false)}
                className="mt-6 w-full border border-burgundy py-4 font-sans text-[11px] uppercase tracking-extreme text-burgundy hover:bg-burgundy hover:text-white"
              >
                Load more
              </button>
            )}
          </>
        )}
      </section>
      {selected.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gold/30 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
          <span className="font-sans text-[13px] text-ink">{selected.size} selected</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setSelected(new Set())} className={actionBtn}>Clear</button>
            <button type="button" disabled={busy} onClick={downloadSelected} className={`${actionBtn} bg-burgundy text-white hover:bg-burgundy-dark`}>Download selected</button>
          </div>
        </div>
      )}
      {open && <Lightbox item={open} onClose={closeLightbox} onMediaError={refresh} />}
    </motion.div>
  )
}
