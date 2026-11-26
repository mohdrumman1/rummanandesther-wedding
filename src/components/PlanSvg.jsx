/* eslint-disable react-refresh/only-export-components -- shared SVG helpers for the admin planner and the public seating page */
import { PLAN_H, PLAN_W, occupantsByTable, seatPositions, tableSize } from '../lib/seatingPlan'

export const BURGUNDY = '#722F37'
export const GOLD = '#C9A96E'
export const GOLD_DARK = '#9E7B3C'
export const INK = '#2A1F1A'
export const CREAM = '#FAF6F0'
export const SERIF = 'Georgia, "Times New Roman", serif'
export const SANS = 'Helvetica, Arial, sans-serif'

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

export function shorten(text, max) {
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

export function Frame({ plan, children, footer }) {
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

function labelText(table, guest) {
  return table.shape === 'rect' ? shorten(guest.name.split(' ')[0], 10) : seatName(guest.name, 13)
}

function labelSpot(seat) {
  const sideways = Math.abs(seat.dx) > 0.35
  return {
    x: seat.x + seat.dx * 22,
    y: seat.y + seat.dy * 22 + (seat.dy > 0.35 ? 11 : seat.dy < -0.35 ? -3 : 4),
    anchor: sideways ? (seat.dx > 0 ? 'start' : 'end') : 'middle',
  }
}

// Which seat labels can be drawn without sitting on another label, a seat or a table.
// The highlighted seat and the selected table go first so their names always win.
function visibleLabels(plan, guestsById, occ, firstTableId, highlight) {
  const hit = (a, b) => a.x0 < b.x1 + 2 && a.x1 > b.x0 - 2 && a.y0 < b.y1 + 1 && a.y1 > b.y0 - 1
  const taken = []
  const cands = []
  for (const table of plan.tables) {
    const { w, h, r } = tableSize(table)
    if (table.shape === 'block') {
      taken.push({ x0: table.x - w / 2, x1: table.x + w / 2, y0: table.y - h / 2, y1: table.y + h / 2 })
      continue
    }
    const half = table.shape === 'round' ? [r, r] : [w / 2, h / 2]
    taken.push({ x0: table.x - half[0], x1: table.x + half[0], y0: table.y - half[1], y1: table.y + half[1] })
    for (const seat of seatPositions({ ...table, x: 0, y: 0 })) {
      taken.push({ x0: table.x + seat.x - 15, x1: table.x + seat.x + 15, y0: table.y + seat.y - 15, y1: table.y + seat.y + 15 })
      const guest = guestsById[(occ[table.id] || {})[seat.i]]
      if (!guest) continue
      const text = labelText(table, guest)
      const spot = labelSpot(seat)
      const width = text.length * 6.4
      const x = table.x + spot.x
      const x0 = spot.anchor === 'start' ? x : spot.anchor === 'end' ? x - width : x - width / 2
      const key = `${table.id}:${seat.i}`
      const rank = highlight?.has(key) ? 0 : table.id === firstTableId ? 1 : 2
      cands.push({ key, rank, box: { x0, x1: x0 + width, y0: table.y + spot.y - 10, y1: table.y + spot.y + 3 } })
    }
  }
  cands.sort((a, b) => a.rank - b.rank)
  const shown = new Set()
  const placed = []
  for (const cand of cands) {
    if (taken.some(t => hit(cand.box, t)) || placed.some(t => hit(cand.box, t))) continue
    placed.push(cand.box)
    shown.add(cand.key)
  }
  return shown
}

export function PlanSvg({ plan, guestsById, interactive = false, fluid = false, viewBox = null, footer = null, selectedId = null, declutter = false, highlightSeats = null, dragOver = null, movingId = null, svgRef, onTableDown }) {
  const occ = occupantsByTable(plan)
  const seatedCount = Object.keys(plan.assignments).length
  const shownLabels = declutter ? visibleLabels(plan, guestsById, occ, selectedId, highlightSeats) : null
  const place = table =>
    interactive
      ? { className: `sp-tbl${movingId === table.id ? ' sp-dragging' : ''}`, style: { transform: `translate(${table.x}px, ${table.y}px)` } }
      : { transform: `translate(${table.x} ${table.y})` }
  const fill = interactive ? 'sp-fill' : undefined
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox || `0 0 ${PLAN_W} ${PLAN_H}`}
      width={interactive || fluid ? '100%' : PLAN_W}
      height={interactive || fluid ? undefined : PLAN_H}
      style={interactive ? { display: 'block', touchAction: 'none', userSelect: 'none' } : fluid ? { display: 'block' } : undefined}
    >
      <Frame plan={plan} footer={footer ?? `${seatedCount} GUESTS SEATED  ·  ${plan.tables.filter(t => t.shape !== 'block').length} TABLES`}>
        {plan.tables.map(table => {
          const selected = selectedId != null && selectedId === table.id
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
                <text y="-2" textAnchor="middle" fontFamily={SERIF} fontSize={table.shape === 'round' ? 14 : 18} fill={INK}>
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
                const seatKey = `${table.id}:${seat.i}`
                const mine = Boolean(highlightSeats?.has(seatKey))
                const label = guest && (!shownLabels || shownLabels.has(seatKey)) ? labelText(table, guest) : ''
                return (
                  <g key={seat.i} data-seat={`${table.id}:${seat.i}`} style={interactive && guest ? { cursor: 'grab' } : undefined}>
                    {mine && <circle cx={seat.x} cy={seat.y} r="21" fill="none" stroke={GOLD} strokeWidth="4" />}
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
                        fontWeight={mine ? 700 : undefined}
                        fill={mine ? BURGUNDY : INK}
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

