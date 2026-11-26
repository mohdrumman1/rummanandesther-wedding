import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import PageHeader from '../components/PageHeader'
import { PlanSvg } from '../components/PlanSvg'
import { PLAN_H, PLAN_W } from '../lib/seatingPlan'
import { fetchPublicSeating } from '../lib/rsvpApi'
import { findMatches, groupMatches } from '../lib/seatingLookup'
import { MENU, MENU_NOTE } from '../lib/menu'
import '../seatingApple.css'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const MAX_SHOWN_MATCHES = 8
// Apple-style settle: no overshoot. Old view fades out fast, new one eases in from its side.
const APPLE_EASE = [0.32, 0.72, 0, 1]
const viewVariants = {
  enter: ({ dir, reduce }) => ({ opacity: 0, x: reduce ? 0 : dir * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.4, ease: APPLE_EASE } },
  exit: ({ dir, reduce }) => ({ opacity: 0, x: reduce ? 0 : dir * -24, transition: { duration: 0.18, ease: 'easeIn' } }),
}
// "Nick Milford" in "Nick Milford & Andrea Elliott" is just noise.
const showHousehold = g => Boolean(g.household) && !g.household.toLowerCase().includes(g.name.toLowerCase())
// The printed QR must always point at the live site, even if this page is
// opened from localhost or a Netlify preview.
const SEATING_URL = 'https://rummanandesther.com/seating'
// Same code that is in the photo-sharing QR; it only keeps strangers off the upload API.
const SHARE_PATH = '/share?c=J3Jn31w4Vg'

export default function SeatingPage() {
  const [plan, setPlan] = useState(null)
  const [seats, setSeats] = useState(null) // null = still loading
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const resultRef = useRef(null)
  const [wholeRoom, setWholeRoom] = useState(false)
  const navigate = useNavigate()
  const [view, setView] = useState('seat') // 'seat' | 'menu'
  const reduce = useReducedMotion() ?? false
  const viewCustom = { dir: view === 'menu' ? 1 : -1, reduce }

  useEffect(() => {
    let cancelled = false
    fetchPublicSeating()
      .then(data => {
        if (cancelled) return
        setPlan(data.plan || null)
        setSeats(data.seats || [])
      })
      .catch(() => {
        if (cancelled) return
        setError('We could not load the seating plan right now. Please check your signal and try again, or ask at the entrance on the day.')
      })
    return () => { cancelled = true }
  }, [attempt])

  const retry = () => {
    setError('')
    setSeats(null)
    setAttempt(n => n + 1)
  }

  const matches = useMemo(() => {
    if (!seats || query.trim().length < 2) return []
    return groupMatches(findMatches(seats, query))
  }, [seats, query])

  const mapPlan = useMemo(() => {
    if (!plan || !seats) return null
    return {
      title: plan.title,
      subtitle: plan.subtitle,
      tables: plan.tables,
      customGuests: [],
      assignments: Object.fromEntries(
        seats.filter(s => s.tableId && s.seat !== null).map(s => [s.id, { tableId: s.tableId, seat: s.seat }]),
      ),
    }
  }, [plan, seats])
  const mapGuests = useMemo(
    () => Object.fromEntries((seats || []).map(s => [s.id, { id: s.id, name: s.name }])),
    [seats],
  )
  const tablesWithGuests = useMemo(() => {
    const byTable = new Map()
    for (const s of seats || []) {
      if (!byTable.has(s.tableId)) byTable.set(s.tableId, { name: s.table, guests: [] })
      byTable.get(s.tableId).guests.push(s.name)
    }
    return [...byTable.values()].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
  }, [seats])

  // Zoom the map onto the guest's table (unless they have two candidates or ask for the whole room).
  const selectedTable = selected && selected.tableIds.length === 1
    ? plan?.tables.find(t => t.id === selected.tableIds[0])
    : null
  const zoomBox = selectedTable && !wholeRoom
    ? (() => {
        const w = 620
        const h = Math.round((w * PLAN_H) / PLAN_W)
        const x = Math.min(Math.max(selectedTable.x - w / 2, 0), PLAN_W - w)
        const y = Math.min(Math.max(selectedTable.y - h / 2, 0), PLAN_H - h)
        return `${Math.round(x)} ${Math.round(y)} ${w} ${h}`
      })()
    : null

  const seatingUrl = SEATING_URL

  const pick = seat => {
    setSelected(seat)
    setWholeRoom(false)
    setQuery(seat.name)
    document.activeElement?.blur?.() // close the phone keyboard
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80)
  }

  const clear = () => {
    setSelected(null)
    setQuery('')
  }

  return (
    <>
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="print:hidden">
        <PageHeader
          title={view === 'menu' ? 'Menu' : 'Find Your Seat'}
          subtitle="Reception · Saturday, 12 December 2026 · Rydges Resort Hunter Valley"
        />

        <section className="py-16 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream">
          <div className="max-w-2xl mx-auto">
            <div className="sp-seg-wrap flex justify-center mb-8">
              <div className="sp-seg" style={{ '--n': 3, '--i': view === 'menu' ? 1 : 0 }}>
                {[
                  ['seat', 'Find Your Seat'],
                  ['menu', 'Menu'],
                ].map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)}>
                    {label}
                  </button>
                ))}
                <button type="button" aria-pressed="false" onClick={() => navigate(SHARE_PATH)}>
                  Share Photos
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false} custom={viewCustom}>
            <motion.div key={view} custom={viewCustom} variants={viewVariants} initial="enter" animate="center" exit="exit">
            {view === 'menu' && (
              <div
                className="relative mx-auto w-full max-w-[560px] bg-white border border-gold/25 overflow-hidden"
                style={{ containerType: 'inline-size', aspectRatio: '2 / 3' }}
              >
                <img src="/images/menu/florals-top.webp" alt="" className="absolute top-0 left-0 w-full" />
                <img src="/images/menu/florals-bottom.webp" alt="" className="absolute bottom-0 left-0 w-full" />
                <img
                  src="/images/menu/menu-script.webp"
                  alt="Menu"
                  className="absolute"
                  style={{ left: '29.3%', width: '42.3%', top: '23.8%' }}
                />
                <div
                  className="absolute inset-x-0 text-center"
                  style={{ top: '33.9%', fontFamily: 'Georgia, "Times New Roman", serif', lineHeight: '2.13cqw' }}
                >
                  {MENU.map(({ course, dishes }) => (
                    <div key={course} style={{ marginBottom: '3.2cqw' }}>
                      <p style={{ fontSize: '1.75cqw', color: '#111', letterSpacing: '0.02em', marginBottom: '2.1cqw' }}>
                        - {course.toUpperCase()} -
                      </p>
                      {dishes.map(dish => (
                        <p
                          key={dish}
                          className="whitespace-pre-line"
                          style={{ fontSize: '1.25cqw', color: '#46608f', textTransform: 'uppercase', marginBottom: '2.1cqw' }}
                        >
                          {dish}
                        </p>
                      ))}
                    </div>
                  ))}
                  <p style={{ fontSize: '1.2cqw', color: '#111', textTransform: 'uppercase', marginTop: '4cqw' }}>{MENU_NOTE}</p>
                </div>
              </div>
            )}

            {view === 'seat' && (<>
            {error && (
              <div className="bg-white border border-burgundy/30 p-8 text-center mb-8">
                <p className="font-serif text-2xl font-light text-burgundy mb-2">Something went wrong</p>
                <p className="font-sans font-light text-[14px] leading-relaxed text-ink/60">{error}</p>
                <button
                  type="button"
                  onClick={retry}
                  className="mt-6 font-sans text-[10px] tracking-ultra uppercase bg-burgundy text-white px-5 py-2 hover:bg-burgundy-dark transition-colors"
                >
                  Try again
                </button>
              </div>
            )}

            {!error && seats === null && (
              <p className="text-center font-sans font-light text-[14px] text-ink/50">
                Loading the seating plan…
              </p>
            )}

            {!error && seats !== null && !plan && (
              <div className="bg-white border border-gold/25 p-8 sm:p-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="h-px w-12 bg-gold/30" />
                  <span className="text-gold/40">◆</span>
                  <span className="h-px w-12 bg-gold/30" />
                </div>
                <h2 className="font-serif text-3xl font-light text-ink mb-3">Seating plan coming soon</h2>
                <p className="font-sans font-light text-[14px] leading-relaxed text-ink/60">
                  We are still finalising the tables for the reception. Check back closer
                  to the day, or ask Rumman &amp; Esther.
                </p>
              </div>
            )}

            {!error && seats !== null && plan && (
              <>
                {/* Search */}
                <div className="bg-white border border-gold/25 p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-6 bg-gold" />
                    <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
                      Reception Seating
                    </span>
                  </div>
                  <label htmlFor="seat-search" className="font-serif text-2xl font-light text-ink block mb-4">
                    Type your name to find your table
                  </label>
                  <form
                    onSubmit={e => {
                      e.preventDefault()
                      if (!selected && matches.length === 1) pick(matches[0])
                    }}
                  >
                  <input
                    id="seat-search"
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelected(null) }}
                    placeholder="e.g. Priya Nair"
                    autoComplete="off"
                    autoCapitalize="words"
                    enterKeyHint="search"
                    className="w-full bg-cream border border-gold/30 px-5 py-4 font-sans text-[15px] text-ink placeholder:text-ink/30 focus:outline-none focus:border-gold"
                  />
                  </form>

                  {query.trim().length >= 2 && !selected && matches.length > 0 && (
                    <div className="mt-4 border border-gold/25 divide-y divide-gold/15">
                      {matches.slice(0, MAX_SHOWN_MATCHES).map(seat => (
                        <button
                          key={`${seat.name}|${seat.household}`}
                          type="button"
                          onClick={() => pick(seat)}
                          className="w-full text-left px-5 py-3 hover:bg-cream transition-colors"
                        >
                          <span className="font-serif text-lg text-ink">{seat.name}</span>
                          {showHousehold(seat) && (
                            <span className="font-sans text-[12px] text-ink/50 ml-3">{seat.household}</span>
                          )}
                        </button>
                      ))}
                      {matches.length > MAX_SHOWN_MATCHES && (
                        <p className="px-5 py-3 font-sans text-[12px] text-ink/50">
                          Showing {MAX_SHOWN_MATCHES} of {matches.length} matches, keep typing to narrow it down.
                        </p>
                      )}
                    </div>
                  )}

                  {query.trim().length >= 2 && !selected && matches.length === 0 && (
                    <p className="mt-4 font-sans font-light text-[14px] leading-relaxed text-ink/60">
                      We could not find that name. Check the spelling, or ask Rumman &amp; Esther
                      and they will point you to your table.
                    </p>
                  )}

                  {query.trim().length < 2 && query.trim().length > 0 && (
                    <p className="mt-4 font-sans font-light text-[13px] text-ink/40">
                      Type at least two letters to search.
                    </p>
                  )}
                </div>

                {/* Result */}
                {selected && (
                  <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-burgundy text-white p-8 sm:p-10 mt-8 text-center"
                  >
                    <p className="font-sans text-[10px] tracking-extreme uppercase text-gold/70 mb-3">
                      {selected.name}
                      {showHousehold(selected) ? ` · ${selected.household}` : ''}
                    </p>
                    <p className="font-sans text-[11px] tracking-ultra uppercase text-white/60 mb-2">
                      You are at
                    </p>
                    <p className="font-serif text-5xl md:text-6xl font-light mb-3">{selected.tables.join(' or ')}</p>
                    {selected.tables.length > 1 && (
                      <p className="font-sans font-light text-[13px] leading-relaxed text-white/70 mb-3">
                        More than one guest has this name. Check your invitation, or ask Rumman &amp; Esther.
                      </p>
                    )}
                    <p className="font-sans font-light text-[13px] text-white/50">
                      Reception · Rydges Resort Hunter Valley · Saturday, 12 December 2026
                    </p>
                    <button
                      type="button"
                      onClick={clear}
                      className="mt-8 font-sans text-[10px] tracking-ultra uppercase border border-white/30 text-white/80 px-5 py-2 hover:border-gold hover:text-gold transition-colors"
                    >
                      Search another name
                    </button>
                  </motion.div>
                )}
              </>
            )}

            {/* Room map */}
            {!error && mapPlan && (
              <div className="bg-white border border-gold/25 p-4 sm:p-8 mt-8 lg:relative lg:left-1/2 lg:-translate-x-1/2 lg:w-[min(1100px,calc(100vw-96px))]">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-6 bg-gold" />
                    <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
                      {zoomBox ? 'Your table' : 'The room'}
                    </span>
                  </div>
                  {selectedTable && (
                    <button
                      type="button"
                      onClick={() => setWholeRoom(w => !w)}
                      className="font-sans text-[10px] tracking-ultra uppercase border border-gold/30 text-gold/80 px-4 py-2 hover:border-gold hover:text-gold transition-colors"
                    >
                      {wholeRoom ? 'Zoom to my table' : 'Show whole room'}
                    </button>
                  )}
                </div>
                <div className={zoomBox ? '' : 'overflow-x-auto'}>
                  <div className={zoomBox ? '' : 'min-w-[900px] lg:min-w-0'}>
                    <PlanSvg
                      plan={mapPlan}
                      guestsById={mapGuests}
                      fluid
                      viewBox={zoomBox}
                      declutter
                      highlightSeats={selected ? new Set(selected.seatKeys) : null}
                      selectedId={selected && selected.tableIds.length === 1 ? selected.tableIds[0] : null}
                      footer="RUMMAN & ESTHER  ·  RECEPTION"
                    />
                  </div>
                </div>
                {!zoomBox && (
                  <p className="font-sans font-light text-[12px] text-ink/40 mt-3 sm:hidden">Swipe sideways to see the whole room.</p>
                )}
              </div>
            )}

            {/* Everyone, by table */}
            {!error && tablesWithGuests.length > 0 && (
              <details className="bg-white border border-gold/25 p-6 sm:p-8 mt-8">
                <summary className="cursor-pointer font-serif text-2xl font-light text-ink">Everyone, table by table</summary>
                <div className="mt-6 grid sm:grid-cols-2 gap-6">
                  {tablesWithGuests.map(table => (
                    <div key={table.name}>
                      <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-2">{table.name}</p>
                      <p className="font-sans font-light text-[14px] leading-relaxed text-ink/70">{table.guests.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}

            </>)}
            </motion.div>
            </AnimatePresence>

            {/* QR code for the entrance */}
            <div className="bg-white border border-gold/25 p-8 sm:p-10 mt-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-6">
                <span className="h-px w-12 bg-gold/30" />
                <span className="text-gold/40">◆</span>
                <span className="h-px w-12 bg-gold/30" />
              </div>
              <h2 className="font-serif text-3xl font-light text-ink mb-3">At the venue</h2>
              <p className="font-sans font-light text-[14px] leading-relaxed text-ink/60 mb-8">
                Scan the code with your phone camera to find your table, see the menu, or share your photos and videos with us.
                The code stays the same even if the seating plan changes.
              </p>
              {seatingUrl && (
                <div className="inline-block bg-white border border-gold/30 p-4">
                  <QRCodeSVG value={seatingUrl} size={200} level="M" />
                </div>
              )}
              <p className="font-sans text-[11px] tracking-wider text-ink/40 mt-4 break-all">{seatingUrl}</p>
              <button
                type="button"
                onClick={() => window.print()}
                className="mt-8 font-sans text-[10px] tracking-ultra uppercase border border-gold/30 text-gold/70 px-5 py-2 hover:border-gold hover:text-gold transition-colors"
              >
                Print entrance sign
              </button>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Entrance sign: only visible when printing */}
      <div className="hidden print:flex print:flex-col print:items-center print:justify-center print:min-h-screen print:text-center print:bg-white print:text-black">
        <p className="print:font-serif print:italic print:text-4xl print:mb-2">Rumman &amp; Esther</p>
        <h1 className="print:text-5xl print:mb-4">Find Your Seat</h1>
        <p className="print:text-lg print:mb-8">
          Reception · Rydges Resort Hunter Valley · Saturday, 12 December 2026
        </p>
        {seatingUrl && <QRCodeSVG value={seatingUrl} size={320} level="M" />}
        <p className="print:text-lg print:mt-8">Scan the code to find your table, see the menu, and share your photos &amp; videos.</p>
      </div>
    </>
  )
}
