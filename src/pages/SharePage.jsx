import { memo, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { Link, useSearchParams } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import { getUploader } from '../lib/uploader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const STATUS_LABEL = {
  queued: 'Waiting',
  uploading: 'Uploading',
  retrying: 'Retrying',
  done: 'Done',
  failed: 'Failed',
}

const STATUS_CLASS = {
  queued: 'text-ink/45',
  uploading: 'text-gold-dark',
  retrying: 'text-burgundy-light',
  done: 'text-green-800',
  failed: 'text-burgundy',
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  if (bytes >= 1024 * 1024) return `${Math.round(bytes / 1024 / 1024)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const Row = memo(function Row({ item, onRetry }) {
  return (
    <li className="flex items-center gap-3 border border-gold/20 bg-white p-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden bg-cream text-xl text-gold/60">
        {item.thumbUrl ? (
          <img src={item.thumbUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <span aria-hidden="true">{item.isVideo ? '▶' : '◆'}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[13px] text-ink">{item.name}</p>
        <div className="mt-2 h-1 w-full bg-gold/15">
          <div
            className="h-full bg-gold transition-[width] duration-300"
            style={{ width: `${Math.round(item.progress * 100)}%` }}
          />
        </div>
        <p className="mt-1.5 flex items-center gap-2 font-sans text-[11px] text-ink/45">
          <span className={`uppercase tracking-ultra ${STATUS_CLASS[item.status]}`}>{STATUS_LABEL[item.status]}</span>
          <span>{formatSize(item.size)}</span>
        </p>
      </div>
      {(item.status === 'failed' || item.status === 'retrying') && (
        <button
          type="button"
          onClick={() => onRetry(item.id)}
          className="shrink-0 border border-burgundy/40 px-3 py-2 font-sans text-[10px] uppercase tracking-ultra text-burgundy"
        >
          Retry
        </button>
      )}
    </li>
  )
})

export default function SharePage() {
  const uploader = getUploader()
  const state = useSyncExternalStore(uploader.subscribe, uploader.getSnapshot)
  const [params] = useSearchParams()
  const urlCode = (params.get('c') || '').trim()
  const inputRef = useRef(null)
  const [name, setName] = useState(state.identity.name)

  useEffect(() => {
    if (urlCode) uploader.setIdentity({ code: urlCode })
  }, [uploader, urlCode])

  const code = urlCode || state.identity.code
  const allDone = state.total > 0 && state.active === 0 && state.failed === 0

  function pick(event) {
    uploader.setIdentity({ name: name.trim(), code })
    uploader.addFiles(event.target.files)
    event.target.value = ''
  }

  const galleryLink = code ? `/gallery?c=${encodeURIComponent(code)}` : '/gallery'
  const galleryButton =
    'block w-full border border-burgundy py-5 text-center font-sans text-[11px] uppercase tracking-extreme text-burgundy transition-colors duration-200 hover:bg-burgundy hover:text-white'

  const backLink =
    'mb-6 flex min-h-[48px] w-full items-center justify-center gap-2 border border-gold bg-white px-5 py-3 font-sans text-[11px] uppercase tracking-ultra text-gold-dark shadow-sm transition-colors duration-200 hover:bg-gold hover:text-white'

  const bigButton =
    'w-full bg-burgundy py-5 font-sans text-[11px] uppercase tracking-extreme text-white transition-colors duration-200 hover:bg-burgundy-dark'

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="min-h-screen bg-cream">
      <PageHeader title="Share Your Photos" subtitle="Add your photos and videos from the day" />
      <section className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <Link to="/seating" className={backLink}>
          ← Back to Find Your Seat
        </Link>
        {state.fatal === 'closed' ? (
          <div className="border border-gold/25 bg-white p-8 text-center">
            <span className="text-2xl text-gold">◆</span>
            <h2 className="mt-4 font-serif text-3xl font-light text-ink">Uploads have closed</h2>
            <p className="mt-3 font-sans text-[14px] font-light leading-6 text-ink/60">
              Thank you so much for sharing your memories with Rumman &amp; Esther. We’re no longer taking new photos and videos.
            </p>
          </div>
        ) : !code || state.fatal ? (
          <div className="border border-gold/25 bg-white p-8 text-center">
            <span className="text-2xl text-gold">◆</span>
            <h2 className="mt-4 font-serif text-3xl font-light text-ink">We can't find your link</h2>
            <p className="mt-3 font-sans text-[14px] font-light leading-6 text-ink/60">
              {code
                ? 'That upload link doesn’t look right. Please scan the QR code again, or ask Rumman & Esther for a fresh link.'
                : 'Please open this page from the QR code or link we shared with you.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label htmlFor="uploaderName" className="mb-2 block font-sans text-[10px] uppercase tracking-extreme text-ink/50">
                Your name (optional)
              </label>
              <input
                id="uploaderName"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onBlur={() => uploader.setIdentity({ name: name.trim() })}
                maxLength={60}
                autoComplete="name"
                placeholder="So we know who to thank"
                className="w-full border border-gold/25 bg-white px-4 py-3 font-sans text-[14px] font-light text-ink placeholder:text-ink/30 focus:border-gold focus:outline-none"
              />
            </div>

            <input ref={inputRef} type="file" multiple accept="image/*,video/*" onChange={pick} className="hidden" />

            {allDone ? (
              <div className="border border-gold/25 bg-white p-8 text-center">
                <span className="text-2xl text-gold">◆</span>
                <h2 className="mt-4 font-serif text-5xl font-light text-ink">Thank you</h2>
                <p className="mt-3 font-sans text-[14px] font-light text-ink/60">
                  {state.done} {state.done === 1 ? 'memory' : 'memories'} safely shared.
                </p>
                <button type="button" onClick={() => inputRef.current?.click()} className={`${bigButton} mt-6`}>
                  Add more
                </button>
                <Link to={galleryLink} className={`${galleryButton} mt-3`}>
                  View Gallery
                </Link>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => inputRef.current?.click()} className={bigButton}>
                  Add photos &amp; videos
                </button>
                <p className="mt-3 text-center font-sans text-[12px] font-light text-ink/50">
                  You can finish later on Wi‑Fi. Uploads stay open for weeks.
                </p>
                <Link to={galleryLink} className={`${galleryButton} mt-5`}>
                  View Gallery
                </Link>
              </>
            )}

            {state.active > 0 && (
              <div className="mt-5 border border-gold/40 bg-gold/10 px-4 py-3 text-center font-sans text-[13px] text-gold-dark">
                {state.online
                  ? 'Keep this screen open until everything says Done.'
                  : 'You’re offline. Uploads will carry on when you’re back online.'}
              </div>
            )}

            {state.total > 0 && (
              <>
                <p className="mt-6 font-sans text-[11px] uppercase tracking-ultra text-ink/45">
                  {state.done} of {state.total} done
                </p>
                <ul className="mt-3 space-y-2">
                  {state.items.map(item => (
                    <Row key={item.id} item={item} onRetry={uploader.retry} />
                  ))}
                </ul>
              </>
            )}
          </>
        )}
      </section>
    </motion.div>
  )
}
