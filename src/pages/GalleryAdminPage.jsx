import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { getAdminToken, clearAdminToken } from '../lib/rsvpApi'
import { deleteAdminMedia, fetchAdminMedia } from '../lib/uploadsApi'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

function formatSize(bytes) {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const isAuthError = err => /login|unauthor|forbidden|token/i.test(err.message || '')

function Tile({ item, onDelete }) {
  const isVideo = (item.content_type || '').startsWith('video/')
  return (
    <div className="border border-gold/20 bg-white">
      <a href={item.originalUrl} target="_blank" rel="noreferrer" className="block aspect-square bg-cream">
        {item.thumbUrl ? (
          <img src={item.thumbUrl} alt={item.filename} loading="lazy" decoding="async" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl text-gold/60" aria-label={isVideo ? 'Video' : 'No preview'}>
            {isVideo ? '▶' : '◆'}
          </span>
        )}
      </a>
      <div className="p-2">
        <p className="truncate font-sans text-[11px] text-ink" title={item.filename}>{item.filename}</p>
        <p className="font-sans text-[10px] text-ink/40">{formatSize(item.size || 0)}</p>
        <div className="mt-2 flex items-center justify-between font-sans text-[10px] uppercase tracking-ultra">
          <a href={item.originalUrl} download={item.filename} className="text-gold-dark hover:text-ink">Download</a>
          <button type="button" onClick={() => onDelete(item)} className="text-burgundy hover:text-burgundy-dark">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function GalleryAdminPage() {
  const [authed, setAuthed] = useState(Boolean(getAdminToken()))
  const [items, setItems] = useState([])
  const [cursor, setCursor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')

  const loadMore = useCallback(async next => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminMedia({ cursor: next })
      setItems(prev => (next ? [...prev, ...(data.items || [])] : data.items || []))
      setCursor(data.nextCursor || null)
      setLoaded(true)
    } catch (err) {
      if (isAuthError(err)) {
        clearAdminToken()
        setAuthed(false)
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    const timer = window.setTimeout(() => loadMore(null), 0)
    return () => window.clearTimeout(timer)
  }, [authed, loadMore])

  async function remove(item) {
    if (!window.confirm(`Delete ${item.filename}? This cannot be undone.`)) return
    try {
      await deleteAdminMedia(item.id)
      setItems(prev => prev.filter(i => i.id !== item.id))
    } catch (err) {
      setError(err.message)
    }
  }

  const groups = useMemo(() => {
    const map = new Map()
    for (const item of items) {
      const key = (item.uploader_name || '').trim() || 'Unknown'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(item)
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [items])

  const totalSize = useMemo(() => items.reduce((sum, i) => sum + (i.size || 0), 0), [items])

  if (!authed) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <PageHeader title="Gallery Admin" subtitle="Guest photos and videos" />
        <section className="bg-cream px-6 py-16 text-center">
          <p className="font-sans text-[14px] font-light text-ink/60">Please sign in to the admin dashboard first.</p>
          <Link to="/admin" className="mt-6 inline-block bg-burgundy px-8 py-4 font-sans text-[10px] uppercase tracking-extreme text-white hover:bg-burgundy-dark">
            Go to admin login
          </Link>
        </section>
      </motion.div>
    )
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Gallery Admin" subtitle="Guest photos and videos" />
      <section className="bg-cream px-6 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-gold/20 bg-white px-5 py-4">
            <p className="font-sans text-[13px] text-ink">
              <strong className="font-medium">{items.length}</strong> files loaded
              <span className="mx-2 text-gold/60">◆</span>
              {formatSize(totalSize)}
              {cursor && <span className="text-ink/40"> (more available)</span>}
            </p>
            <Link to="/admin" className="font-sans text-[10px] uppercase tracking-ultra text-gold-dark hover:text-ink">Back to RSVPs</Link>
          </div>

          {error && (
            <div className="border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-center font-sans text-[13px] text-burgundy">{error}</div>
          )}

          {loaded && items.length === 0 && !loading && (
            <p className="text-center font-sans text-[14px] font-light text-ink/50">No uploads yet.</p>
          )}

          {groups.map(([name, list]) => (
            <div key={name}>
              <h2 className="mb-4 font-serif text-3xl font-light text-ink">
                {name} <span className="font-sans text-[12px] text-ink/40">{list.length}</span>
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {list.map(item => <Tile key={item.id} item={item} onDelete={remove} />)}
              </div>
            </div>
          ))}

          {cursor && (
            <div className="text-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => loadMore(cursor)}
                className="bg-burgundy px-10 py-4 font-sans text-[10px] uppercase tracking-extreme text-white hover:bg-burgundy-dark disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
          {loading && !cursor && <p className="text-center font-sans text-[13px] text-ink/40">Loading...</p>}
        </div>
      </section>
    </motion.div>
  )
}
