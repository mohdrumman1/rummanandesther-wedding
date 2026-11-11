import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { fetchSeatingPlan, saveSeatingPlan } from '../lib/rsvpApi'
import '../seatingApple.css'
import {
  PLAN_H,
  PLAN_W,
  applyVenueLayout,
  assign,
  autoSeat,
  buildPdf,
  canvasToBlob,
  clampTable,
  downloadBlob,
  emptyPlan,
  makeTable,
  newId,
  occupantsByTable,
  optimizeLayout,
  pruneAssignments,
  seatFromList,
  seatPositions,
  svgToCanvas,
  tableSize,
  unassign,
  venuePlan,
} from '../lib/seatingPlan'

const BURGUNDY = '#722F37'
const GOLD = '#C9A96E'
const GOLD_DARK = '#9E7B3C'
const INK = '#2A1F1A'
const CREAM = '#FAF6F0'
const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = 'Helvetica, Arial, sans-serif'

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

function shorten(text, max) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// Seat labels sit between neighbouring tables, so keep them short: "Priya Nair" -> "Priya N.", "Dr Sinija Rao" -> "Dr Sinija".
const TITLES = new Set(['dr', 'mr', 'mrs', 'ms', 'miss', 'prof', 'rev', 'master'])
function seatName(name, max) {
  if (name.length <= 10) return name
  const parts = name.split(/\s+/)
  if (parts.length < 2) return shorten(name, max)
  if (TITLES.has(parts[0].toLowerCase().replace('.', ''))) return shorten(`${parts[0]} ${parts[1]}`, max)
  return shorten(`${parts[0]} ${parts[parts.length - 1][0]}.`, max)
}

function Frame({ plan, children, footer }) {
  return (
    <>
      <rect width={PLAN_W} height={PLAN_H} fill={CREAM} />
      <rect x="22" y="22" width={PLAN_W - 44} height={PLAN_H - 44} fill="none" stroke={GOLD} strokeWidth="1.5" />
      <rect x="32" y="32" width={PLAN_W - 64} height={PLAN_H - 64} fill="none" stroke={GOLD} strokeWidth="0.6" />
      <text x={PLAN_W / 2} y="86" textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize="46" fill={BURGUNDY}>
        {plan.title}
      </text>
      <text x={PLAN_W / 2} y="114" textAnchor="middle" fontFamily={SANS} fontSize="12" letterSpacing="5" fill={GOLD_DARK}>
        {String(plan.subtitle || '').toUpperCase()}
      </text>
      <line x1={PLAN_W / 2 - 90} x2={PLAN_W / 2 + 90} y1="128" y2="128" stroke={GOLD} strokeWidth="1" />
      {children}
      <text x={PLAN_W / 2} y={PLAN_H - 48} textAnchor="middle" fontFamily={SANS} fontSize="11" letterSpacing="3" fill={GOLD_DARK}>
        {footer}
      </text>
    </>
  )
}

function PlanSvg({ plan, guestsById, interactive = false, selectedId = null, dragOver = null, movingId = null, svgRef, onTableDown }) {
  const occ = occupantsByTable(plan)
  const seatedCount = Object.keys(plan.assignments).length
  const place = table =>
    interactive
      ? { className: `sp-tbl${movingId === table.id ? ' sp-dragging' : ''}`, style: { transform: `translate(${table.x}px, ${table.y}px)` } }
      : { transform: `translate(${table.x} ${table.y})` }
  const fill = interactive ? 'sp-fill' : undefined
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
      width={interactive ? '100%' : PLAN_W}
      height={interactive ? undefined : PLAN_H}
      style={interactive ? { display: 'block', touchAction: 'none', userSelect: 'none' } : undefined}
    >
      <Frame plan={plan} footer={`${seatedCount} GUESTS SEATED  ·  ${plan.tables.filter(t => t.shape !== 'block').length} TABLES`}>
        {plan.tables.map(table => {
          const selected = interactive && selectedId === table.id
          if (table.shape === 'block') {
            const { w, h } = tableSize(table)
            const size = Math.max(10, Math.min(22, h * 0.42, (w - 16) / (table.name.length * 0.52)))
            return (
              <g key={table.id} {...place(table)}>
                <g
                  data-table-body={table.id}
                  onPointerDown={interactive ? e => onTableDown(e, table) : undefined}
                  style={interactive ? { cursor: 'grab' } : undefined}
                >
                  <rect className={fill} x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill="#F1E7D3" stroke={selected ? BURGUNDY : GOLD} strokeWidth={selected ? 2.5 : 1.2} strokeDasharray="8 5" />
                  <text y={size * 0.33} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={size} fill={GOLD_DARK}>{table.name}</text>
                </g>
              </g>
            )
          }
          const { w, h, r } = tableSize(table)
          const seats = seatPositions({ ...table, x: 0, y: 0 })
          const filled = Object.keys(occ[table.id] || {}).length
          return (
            <g key={table.id} {...place(table)}>
              <g
                data-table-body={table.id}
                onPointerDown={interactive ? e => onTableDown(e, table) : undefined}
                style={interactive ? { cursor: 'grab' } : undefined}
              >
                {table.shape === 'round' ? (
                  <circle className={fill} r={r} fill="#fff" stroke={selected ? BURGUNDY : GOLD} strokeWidth={selected ? 3 : 1.5} />
                ) : (
                  <rect className={fill} x={-w / 2} y={-h / 2} width={w} height={h} rx="8" fill="#fff" stroke={selected ? BURGUNDY : GOLD} strokeWidth={selected ? 3 : 1.5} />
                )}
                {table.shape === 'round'
                  ? <circle className={fill} r={r} fill={GOLD} opacity={dragOver === `table:${table.id}` ? 0.25 : 0} />
                  : <rect className={fill} x={-w / 2} y={-h / 2} width={w} height={h} rx="8" fill={GOLD} opacity={dragOver === `table:${table.id}` ? 0.25 : 0} />}
                <text y="-2" textAnchor="middle" fontFamily={SERIF} fontSize={table.shape === 'round' ? 19 : 18} fill={INK}>
                  {shorten(table.name, 14)}
                </text>
                <text y="18" textAnchor="middle" fontFamily={SANS} fontSize="11" letterSpacing="1.5" fill={GOLD_DARK}>
                  {filled}/{table.seats}
                </text>
              </g>
              {seats.map(seat => {
                const guest = guestsById[(occ[table.id] || {})[seat.i]]
                const hot = dragOver === `seat:${table.id}:${seat.i}`
                const sideways = Math.abs(seat.dx) > 0.35
                const label = guest ? (table.shape === 'rect' ? shorten(guest.name.split(' ')[0], 10) : seatName(guest.name, 13)) : ''
                return (
                  <g key={seat.i} data-seat={`${table.id}:${seat.i}`} style={interactive && guest ? { cursor: 'grab' } : undefined}>
                    <circle
                      className={fill}
                      cx={seat.x}
                      cy={seat.y}
                      r="15"
                      fill={guest ? BURGUNDY : hot ? GOLD : '#fff'}
                      stroke={hot ? BURGUNDY : GOLD}
                      strokeWidth={hot ? 2.5 : 1.2}
                      strokeDasharray={guest ? undefined : '3 3'}
                    />
                    {guest ? (
                      <text x={seat.x} y={seat.y + 4} textAnchor="middle" fontFamily={SANS} fontSize="10.5" fontWeight="600" fill="#fff" pointerEvents="none">
                        {initials(guest.name)}
                      </text>
                    ) : (
                      <text x={seat.x} y={seat.y + 3.5} textAnchor="middle" fontFamily={SANS} fontSize="9" fill={GOLD} pointerEvents="none">
                        {seat.i + 1}
                      </text>
                    )}
                    {label && (
                      <text
                        key={guest.id}
                        className={interactive ? 'sp-label' : undefined}
                        x={seat.x + seat.dx * 22}
                        y={seat.y + seat.dy * 22 + (seat.dy > 0.35 ? 11 : seat.dy < -0.35 ? -3 : 4)}
                        textAnchor={sideways ? (seat.dx > 0 ? 'start' : 'end') : 'middle'}
                        fontFamily={SANS}
                        fontSize="12"
                        fill={INK}
                        pointerEvents="none"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                )
              })}
            </g>
          )
        })}
      </Frame>
    </svg>
  )
}

const CARDS_PER_PAGE = 6

function ListSvg({ plan, guestsById, tables, page, pages }) {
  const occ = occupantsByTable(plan)
  const cardW = 450
  const cardH = 420
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${PLAN_W} ${PLAN_H}`} width={PLAN_W} height={PLAN_H}>
      <Frame plan={{ ...plan, title: 'Guest List by Table' }} footer={`PAGE ${page} OF ${pages}`}>
        {tables.map((table, n) => {
          const x = 80 + (n % 3) * (cardW + 45)
          const y = 170 + Math.floor(n / 3) * (cardH + 40)
          const rows = Array.from({ length: table.seats }, (_, i) => guestsById[(occ[table.id] || {})[i]])
          const lineH = Math.min(28, 320 / Math.max(1, table.seats))
          return (
            <g key={table.id}>
              <rect x={x} y={y} width={cardW} height={cardH} fill="#fff" stroke={GOLD} strokeWidth="1.2" />
              <rect x={x} y={y} width={cardW} height="58" fill={BURGUNDY} />
              <text x={x + 22} y={y + 37} fontFamily={SERIF} fontStyle="italic" fontSize="26" fill="#fff">{shorten(table.name, 22)}</text>
              <text x={x + cardW - 22} y={y + 36} textAnchor="end" fontFamily={SANS} fontSize="11" letterSpacing="2" fill={GOLD}>
                {rows.filter(Boolean).length}/{table.seats}
              </text>
              {rows.map((guest, i) => (
                <g key={i}>
                  <text x={x + 22} y={y + 92 + i * lineH} fontFamily={SANS} fontSize="12" fill={GOLD_DARK}>{i + 1}</text>
                  <text x={x + 52} y={y + 92 + i * lineH} fontFamily={SERIF} fontSize={Math.min(19, lineH - 5)} fill={guest ? INK : '#c9bfb3'} fontStyle={guest ? 'normal' : 'italic'}>
                    {guest ? shorten(guest.name, 30) : 'empty'}
                  </text>
                  {guest?.dietary && (
                    <text x={x + cardW - 20} y={y + 92 + i * lineH} textAnchor="end" fontFamily={SANS} fontSize="10" fill={BURGUNDY}>
                      {shorten(guest.dietary, 22)}
                    </text>
                  )}
                </g>
              ))}
            </g>
          )
        })}
      </Frame>
    </svg>
  )
}

function rsvpGuests(groups) {
  const out = []
  groups.forEach(group => {
    ;(group.guests || []).forEach(guest => {
      const name = String(guest.name || '').trim()
      if (!name || guest.receptionInvited === false) return
      out.push({
        id: guest.id,
        name,
        household: group.householdName,
        attending: guest.receptionAttending,
        dietary: group.rsvp?.dietaryRequirements || '',
      })
    })
  })
  return out
}

export default function SeatingPlanner({ groups }) {
  const [plan, setPlan] = useState(venuePlan)
  const [loaded, setLoaded] = useState(false)
  const [saveState, setSaveState] = useState('')
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [onlyUnseated, setOnlyUnseated] = useState(true)
  const [showDeclined, setShowDeclined] = useState(false)
  const [onlyComing, setOnlyComing] = useState(false)
  const [newName, setNewName] = useState('')
  const [drag, setDrag] = useState(null) // { guestId, x, y, over }
  const [exporting, setExporting] = useState('')
  const [movingId, setMovingId] = useState(null)
  const [notice, setNotice] = useState('')
  const [undoTables, setUndoTables] = useState(null)
  const groupsRef = useRef(groups)
  useEffect(() => {
    groupsRef.current = groups
  }, [groups])
  const svgRef = useRef(null)
  const dirty = useRef(false)

  useEffect(() => {
    let cancelled = false
    fetchSeatingPlan()
      .then(data => {
        if (cancelled) return
        if (data.plan) setPlan({ ...emptyPlan(), ...data.plan })
        else {
          // First visit: start from the venue layout with the agreed table list seated.
          const { plan: seeded } = seatFromList(venuePlan(), rsvpGuests(groupsRef.current))
          dirty.current = true
          setSaveState('Unsaved changes')
          setPlan(seeded)
        }
      })
      .catch(err => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoaded(true))
    return () => {
      cancelled = true
    }
  }, [])

  const update = useCallback(fn => {
    dirty.current = true
    setSaveState('Unsaved changes')
    setPlan(fn)
  }, [])

  useEffect(() => {
    if (!loaded || !dirty.current) return
    const timer = setTimeout(async () => {
      setSaveState('Saving…')
      try {
        await saveSeatingPlan(plan)
        dirty.current = false
        setSaveState('Saved')
      } catch (err) {
        setSaveState('')
        setError(err.message)
      }
    }, 900)
    return () => clearTimeout(timer)
  }, [plan, loaded])

  const allGuests = useMemo(
    () => [
      ...rsvpGuests(groups),
      ...plan.customGuests.map(g => ({ id: g.id, name: g.name, household: 'Added by hand', attending: true, dietary: '', custom: true })),
    ],
    [groups, plan.customGuests],
  )
  const guestsById = useMemo(() => Object.fromEntries(allGuests.map(g => [g.id, g])), [allGuests])
  const tableNameById = useMemo(() => Object.fromEntries(plan.tables.map(t => [t.id, t.name])), [plan.tables])

  const poolGuests = useMemo(
    () => allGuests.filter(g => showDeclined || g.attending !== false),
    [allGuests, showDeclined],
  )
  const visible = poolGuests.filter(g => {
    if (onlyUnseated && plan.assignments[g.id]) return false
    if (onlyComing && g.attending !== true) return false
    const q = query.trim().toLowerCase()
    return !q || g.name.toLowerCase().includes(q) || g.household.toLowerCase().includes(q)
  })
  const seatedCount = poolGuests.filter(g => plan.assignments[g.id]).length
  const selected = plan.tables.find(t => t.id === selectedId)

  // ----- pointer handling -----
  function svgPoint(e) {
    const svg = svgRef.current
    const m = svg.getScreenCTM().inverse()
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m)
    return { x: p.x, y: p.y }
  }

  function hitTarget(x, y) {
    for (const el of document.elementsFromPoint(x, y)) {
      const seat = el.closest?.('[data-seat]')
      if (seat) return `seat:${seat.getAttribute('data-seat')}`
      const body = el.closest?.('[data-table-body]')
      if (body) return `table:${body.getAttribute('data-table-body')}`
      if (el.closest?.('[data-pool]')) return 'pool'
    }
    return null
  }

  function startGuestDrag(e, guestId) {
    if (e.button !== 0) return
    const startX = e.clientX
    const startY = e.clientY
    let active = false
    const move = ev => {
      if (!active && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return
      active = true
      setDrag({ guestId, x: ev.clientX, y: ev.clientY, over: hitTarget(ev.clientX, ev.clientY) })
    }
    const up = ev => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      setDrag(null)
      if (!active) return
      const target = hitTarget(ev.clientX, ev.clientY)
      if (!target) return
      if (target === 'pool') update(p => unassign(p, guestId))
      else if (target.startsWith('seat:')) {
        const [, tableId, seat] = target.split(':')
        update(p => assign(p, guestId, tableId, Number(seat)))
      } else if (target.startsWith('table:')) update(p => assign(p, guestId, target.slice(6), null))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  function onSvgPointerDown(e) {
    const seatEl = e.target.closest('[data-seat]')
    if (!seatEl) return
    const [tableId, seat] = seatEl.getAttribute('data-seat').split(':')
    const guestId = occupantsByTable(plan)[tableId]?.[Number(seat)]
    if (guestId) {
      e.stopPropagation()
      startGuestDrag(e, guestId)
    }
  }

  function onTableDown(e, table) {
    if (e.target.closest('[data-seat]')) return
    e.preventDefault()
    setSelectedId(table.id)
    setMovingId(table.id)
    const start = svgPoint(e)
    const origin = { x: table.x, y: table.y }
    const move = ev => {
      const p = svgPoint(ev)
      update(prev => ({
        ...prev,
        tables: prev.tables.map(t => (t.id === table.id ? clampTable({ ...t, x: origin.x + p.x - start.x, y: origin.y + p.y - start.y }) : t)),
      }))
    }
    const up = () => {
      setMovingId(null)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  // ----- table editing -----
  function addTable(shape, seats) {
    const id = newId('tbl')
    setSelectedId(id)
    update(p => ({ ...p, tables: [...p.tables, makeTable(p, shape, seats, id)] }))
  }

  function patchTable(id, patch) {
    update(p => pruneAssignments({
      ...p,
      tables: p.tables.map(t => (t.id === id ? clampTable({ ...t, ...patch }) : t)),
    }))
  }

  function removeTable(id) {
    if (!window.confirm('Remove this table? Its guests go back to the unseated list.')) return
    setSelectedId(null)
    update(p => pruneAssignments({ ...p, tables: p.tables.filter(t => t.id !== id) }))
  }

  function duplicateTable(table) {
    const copy = clampTable({ ...table, id: newId('tbl'), name: `${table.name} copy`, x: table.x + 60, y: table.y + 60 })
    setSelectedId(copy.id)
    update(p => ({ ...p, tables: [...p.tables, copy] }))
  }

  function addCustomGuest(e) {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    update(p => ({ ...p, customGuests: [...p.customGuests, { id: newId('cg'), name }] }))
    setNewName('')
  }

  function removeCustomGuest(id) {
    update(p => unassign({ ...p, customGuests: p.customGuests.filter(g => g.id !== id) }, id))
  }

  function resetToVenue() {
    if (!window.confirm('Reset tables to the Rydges Cabernet & Merlot floorplan (12 tables)? Guests keep their seats where the table still exists.')) return
    setSelectedId(null)
    update(p => applyVenueLayout(p))
  }

  function loadTableList() {
    if (!window.confirm('Seat the 12-table guest list? This replaces the current seating for everyone on that list.')) return
    const { plan: seeded, matched, custom } = seatFromList(plan.tables.some(t => /^tbl_v\d+$/.test(t.id)) ? plan : applyVenueLayout(plan), rsvpGuests(groups))
    setNotice(`${matched} matched to RSVP guests${custom.length ? `; added by hand (no RSVP match): ${custom.join(', ')}` : ''}.`)
    update(() => seeded)
  }

  function optimize() {
    setUndoTables(plan.tables)
    setNotice('Tables re-spaced evenly: clear walkways, ringed around the dance floor, room at the bars.')
    update(p => optimizeLayout(p))
  }

  function undoOptimize() {
    const back = undoTables
    setUndoTables(null)
    setNotice('')
    update(p => ({ ...p, tables: back }))
  }

  function clearSeating() {
    if (!window.confirm('Unseat every guest? Tables stay where they are.')) return
    update(p => ({ ...p, assignments: {} }))
  }

  // ----- export -----
  async function exportAs(kind) {
    setExporting(kind)
    setError('')
    try {
      const planSvg = renderToStaticMarkup(<PlanSvg plan={plan} guestsById={guestsById} />)
      const planCanvas = await svgToCanvas(planSvg, PLAN_W, PLAN_H, 2)
      if (kind === 'png') {
        downloadBlob(await canvasToBlob(planCanvas, 'image/png'), 'seating-plan.png')
        return
      }
      const seated = plan.tables.filter(t => t.shape !== 'block')
      const pages = Math.ceil(seated.length / CARDS_PER_PAGE)
      const canvases = [planCanvas]
      for (let i = 0; i < pages; i++) {
        const svg = renderToStaticMarkup(
          <ListSvg plan={plan} guestsById={guestsById} tables={seated.slice(i * CARDS_PER_PAGE, (i + 1) * CARDS_PER_PAGE)} page={i + 1} pages={pages} />,
        )
        canvases.push(await svgToCanvas(svg, PLAN_W, PLAN_H, 2))
      }
      downloadBlob(await buildPdf(canvases), 'seating-plan.pdf')
    } catch (err) {
      setError(err.message)
    } finally {
      setExporting('')
    }
  }

  if (!loaded) {
    return <div className="sp"><p className="sp-hint">Loading seating plan…</p></div>
  }

  const ghostGuest = drag && guestsById[drag.guestId]

  return (
    <div className="sp space-y-4">
      {notice && (
        <div className="sp-card sp-pop sp-hint flex items-center justify-between gap-3" role="status">
          <span>{notice}</span>
          {undoTables && <button type="button" className="sp-btn sp-tint" onClick={undoOptimize}>Undo</button>}
        </div>
      )}
      {error && <div className="sp-card" role="alert" style={{ color: 'var(--accent)' }}>{error}</div>}

      <div className="sp-bar">
        <button type="button" className="sp-btn sp-primary" onClick={() => addTable('round', 8)}>+ Round table</button>
        <button type="button" className="sp-btn" onClick={() => addTable('rect', 10)}>+ Long table</button>
        <button type="button" className="sp-btn" onClick={() => addTable('block', 0)}>+ Dance floor / stage</button>
        <button
          type="button"
          className="sp-btn"
          disabled={!plan.tables.length}
          onClick={() => update(p => autoSeat(p, poolGuests))}
          title="Seat everyone still unseated, keeping households together"
        >
          Auto-seat the rest
        </button>
        <button type="button" className="sp-btn" disabled={!seatedCount} onClick={clearSeating}>Unseat all</button>
        <button type="button" className="sp-btn" disabled={!plan.tables.some(t => t.shape !== 'block')} onClick={optimize} title="Spread the tables evenly over the free floor, with proper walkways">Optimize layout</button>
        <button type="button" className="sp-btn" onClick={resetToVenue} title="Rydges Cabernet & Merlot floorplan, 12 tables">Venue layout</button>
        <button type="button" className="sp-btn" onClick={loadTableList} title="Seat the agreed 12-table list, matched to RSVP spellings">Guest tables</button>
        <span className="sp-status" aria-live="polite">{saveState}</span>
        <button type="button" className="sp-btn" disabled={Boolean(exporting)} onClick={() => exportAs('png')}>
          {exporting === 'png' ? 'Rendering…' : 'Download image'}
        </button>
        <button type="button" className="sp-btn sp-tint" disabled={Boolean(exporting)} onClick={() => exportAs('pdf')}>
          {exporting === 'pdf' ? 'Rendering…' : 'Download PDF'}
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <aside data-pool className="sp-card space-y-3 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
          <div className="flex items-baseline justify-between">
            <h2>Guests</h2>
            <p className="sp-hint">{seatedCount} of {poolGuests.length} seated</p>
          </div>
          <input className="sp-input" placeholder="Search name or household" aria-label="Search guests" value={query} onChange={e => setQuery(e.target.value)} />
          <label className="sp-check">
            <input type="checkbox" checked={onlyUnseated} onChange={e => setOnlyUnseated(e.target.checked)} /> Unseated only
          </label>
          <label className="sp-check">
            <input type="checkbox" checked={onlyComing} onChange={e => { setOnlyComing(e.target.checked); if (e.target.checked) setShowDeclined(false) }} /> Marked as coming only
          </label>
          <label className="sp-check">
            <input type="checkbox" checked={showDeclined} onChange={e => { setShowDeclined(e.target.checked); if (e.target.checked) setOnlyComing(false) }} /> Include declined
          </label>
          <form onSubmit={addCustomGuest} className="flex gap-2">
            <input className="sp-input" placeholder="Add a guest by hand" aria-label="Add a guest by hand" value={newName} onChange={e => setNewName(e.target.value)} />
            <button type="submit" className="sp-btn sp-tint">Add</button>
          </form>
          <p className="sp-hint">Drag a guest onto a table or a seat. Drag a seated guest to move or swap, or back here to unseat.</p>
          <ul className="space-y-1.5">
            {visible.map(guest => {
              const spot = plan.assignments[guest.id]
              return (
                <li key={guest.id} onPointerDown={e => startGuestDrag(e, guest.id)} className="sp-guest">
                  <span className="min-w-0">
                    <span className="block truncate text-[14px]">{guest.name}</span>
                    <span className="block truncate sp-hint">
                      {guest.household}
                      {guest.attending === true ? ' · yes' : guest.attending === false ? ' · declined' : ' · pending'}
                      {guest.dietary ? ` · ${guest.dietary}` : ''}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-2">
                    {spot && <span className="sp-badge"><span className="sp-dot" />{tableNameById[spot.tableId]}</span>}
                    {guest.custom && (
                      <button type="button" aria-label={`Remove ${guest.name}`} onPointerDown={e => e.stopPropagation()} onClick={() => removeCustomGuest(guest.id)} className="sp-btn" style={{ padding: '0 10px' }}>×</button>
                    )}
                  </span>
                </li>
              )
            })}
            {!visible.length && <li className="sp-hint">No guests to show.</li>}
          </ul>
        </aside>

        <div className="space-y-4">
          <div className="sp-card sp-canvas" onPointerDown={onSvgPointerDown}>
            <PlanSvg
              plan={plan}
              guestsById={guestsById}
              interactive
              selectedId={selectedId}
              dragOver={drag?.over}
              movingId={movingId}
              svgRef={svgRef}
              onTableDown={onTableDown}
            />
          </div>
          {!plan.tables.length && <p className="sp-hint">Add a table to begin, or tap Venue layout. Tables can be dragged anywhere on the plan.</p>}
          {selected && (
            <div key={selected.id} className="sp-card sp-pop grid gap-3 sm:grid-cols-[1fr_120px_auto]">
              <label>
                Name
                <input className="sp-input mt-1" value={selected.name} onChange={e => patchTable(selected.id, { name: e.target.value })} />
              </label>
              {selected.shape === 'block' ? (
                <div className="grid grid-cols-2 gap-2">
                  <label>
                    Width
                    <input className="sp-input mt-1" type="number" min="80" max="900" value={selected.w} onChange={e => patchTable(selected.id, { w: Number(e.target.value) || 80 })} />
                  </label>
                  <label>
                    Height
                    <input className="sp-input mt-1" type="number" min="30" max="600" value={selected.h} onChange={e => patchTable(selected.id, { h: Number(e.target.value) || 30 })} />
                  </label>
                </div>
              ) : (
                <label>
                  Seats
                  <input className="sp-input mt-1" type="number" min="1" max="24" value={selected.seats} onChange={e => patchTable(selected.id, { seats: Math.min(24, Math.max(1, Number(e.target.value) || 1)) })} />
                </label>
              )}
              <div className="flex items-end gap-2">
                {selected.shape !== 'block' && (
                  <button type="button" className="sp-btn" onClick={() => patchTable(selected.id, { shape: selected.shape === 'round' ? 'rect' : 'round' })}>
                    {selected.shape === 'round' ? 'Make long' : 'Make round'}
                  </button>
                )}
                <button type="button" className="sp-btn" onClick={() => duplicateTable(selected)}>Duplicate</button>
                <button type="button" className="sp-btn sp-tint" onClick={() => removeTable(selected.id)}>Remove</button>
              </div>
            </div>
          )}
          <div className="sp-card grid gap-3 sm:grid-cols-2">
            <label>
              Plan title
              <input className="sp-input mt-1" value={plan.title} onChange={e => update(p => ({ ...p, title: e.target.value }))} />
            </label>
            <label>
              Subtitle
              <input className="sp-input mt-1" value={plan.subtitle} onChange={e => update(p => ({ ...p, subtitle: e.target.value }))} />
            </label>
          </div>
        </div>
      </div>

      {drag && ghostGuest && (
        <div className="sp-ghost" style={{ transform: `translate(${drag.x + 12}px, ${drag.y + 12}px)` }}>
          {ghostGuest.name}
        </div>
      )}
    </div>
  )
}
