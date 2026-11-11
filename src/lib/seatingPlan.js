export const PLAN_W = 1600
export const PLAN_H = 1131 // A3 landscape ratio, so page 1 of the PDF is the plan itself
export const HEADER_H = 130

export const SEATED_SHAPES = ['round', 'rect']

export function emptyPlan() {
  return {
    title: 'Seating Plan',
    subtitle: 'Rumman & Esther',
    tables: [],
    assignments: {},
    customGuests: [],
  }
}

// The agreed table list (first names as given; spellings are matched against the RSVP database).
export const TABLE_LIST = [
  ['Mercy', 'Roshan', 'Suja', 'Elijah', 'Suraj', 'Joe', 'Sumi', 'Janine'],
  ['Suma', 'Dr. Jeffrin', 'Sudha', 'Damien', 'Sam', 'Abbey', 'James', 'Mathew'],
  ['Erin', 'Jonathan', 'Noah', 'Lida', 'Hameeda', 'Ekta', 'Dr. Nevin'],
  ['Saleem', 'Shafeela', 'Nifri', 'Yusuf', 'Maree', 'Hansraj', 'Rakesh', 'Archana'],
  ['Joy', 'Anju', 'Azeem', 'Shahinaz', 'Siby', 'Shashi', 'Narayanan', 'Lalitha'],
  ['Swathi', 'Dave', 'Ben', 'Swetha', 'Neelam', 'Keitan', 'Shila', 'Ram', 'Phani'],
  ['Shaji', 'Sheeja', 'Gracy', 'Rosamma', 'Geetha', 'Bipro', 'Greg', 'Bryne'],
  ['Simi', 'George', 'Sanjeev', 'Sheryl', 'Sanjay', 'Sanjith', 'Child 1', 'Child 2'],
  ['Anil', 'Sunny', 'Suzy', 'Paul', 'Solomon', 'Sophy', 'Kathan', 'Kathan Partner'],
  ['Ashish', 'Himanshi', 'Arun', 'Aimee', 'Daisy', 'Matilda', 'Roshan', 'Ammu'],
  ['Anil', 'Preema', 'Shijo', 'Preethy', 'Jaydon', 'Tanya', 'Neeraj', 'Neha'],
  ['Sharon', 'Tony', 'Alex', 'Minny', 'Anil', 'Vinny', 'Roy', 'Anima', 'Shafi'],
]

// Names from the first table list that are really someone on the invite list under a fuller name.
// 'Name' or 'Name|Household' (when two guests share a name).
export const NAME_LINKS = {
  mercy: 'Ammachi',
  sumi: 'Sunita Philip',
  hameeda: 'Hameeda',
  suzy: 'Susymamma',
  maree: 'Mareena',
  ekta: 'Ekta',
  shahinaz: 'Shahi|Dr Azeem & Shahi',
  saleem: 'Dr Saleem Lathif',
  shafeela: 'Dr Shafeela',
  nifri: 'Nifri',
  yusuf: 'Dr Yusuf Kumble',
  rakesh: 'Dr Rakesh PV',
  archana: 'Dr Archana',
  joy: 'Dr Joy Antony',
  anju: 'Anju|Anju and Dr Joy Antony',
  narayanan: 'Dr Narayanan V',
  lalitha: 'Lalita',
  dave: 'Dr Dev',
  neha: 'Neeha',
  'kathan partner': 'Teresa Nguyen (my partner)',
  roy: 'Dr Roy Thomas',
  sanjeev: 'Thomas Abraham',
  tony: 'Dr Thomas Mathai',
  minny: 'Anne|Anne and Dr Alex Thomas',
  anima: 'Annina',
}

const nameKey = text => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

// Guests the first table list matched to the wrong person; they are swapped for the right one.
export const NAME_FIXES = {
  shahinaz: 'Shahi|Dr Azeem & Shahi',
  'shimmy chatterjee': 'Alice|George & Alice',
  'aaron atty': 'Dr Sharon',
  'alex yan': 'Dr Alex Thomas',
}

// Swap hand-added (and wrongly matched) guests for the invite-list guest they really are, keeping the seat.
export function linkHandAdded(plan, guests) {
  const linked = []
  const skipped = []
  let next = plan
  const invited = guests.filter(g => !g.custom)
  const entries = [
    ...plan.customGuests.map(c => ({ id: c.id, name: c.name, target: NAME_LINKS[nameKey(c.name)] || c.name, custom: true })),
    // Shahinaz was added as a new guest by mistake (she is Shahi); her seat may outlive the guest row.
    ...(plan.assignments.gst_shahinaz && !invited.some(g => g.id === 'gst_shahinaz') ? [{ id: 'gst_shahinaz', name: 'Shahinaz', target: NAME_FIXES.shahinaz }] : []),
    ...invited.filter(g => NAME_FIXES[nameKey(g.name)] && plan.assignments[g.id]).map(g => ({ id: g.id, name: g.name, target: NAME_FIXES[nameKey(g.name)] })),
  ]
  entries.forEach(entry => {
    const [targetName, targetHousehold] = entry.target.split('|')
    const hits = invited.filter(g => nameKey(g.name) === nameKey(targetName) && (!targetHousehold || g.household === targetHousehold))
    if (hits.length !== 1) return skipped.push(entry.name)
    const guest = hits[0]
    const assignments = { ...next.assignments }
    const seat = assignments[entry.id]
    delete assignments[entry.id]
    delete assignments[guest.id] // already seated elsewhere: move them
    if (seat) assignments[guest.id] = seat
    next = { ...next, assignments, customGuests: entry.custom ? next.customGuests.filter(x => x.id !== entry.id) : next.customGuests }
    linked.push(`${entry.name} → ${guest.name}`)
  })
  return { plan: next, linked, skipped }
}

// Cabernet & Merlot room at Rydges Hunter Valley, from the venue floorplan
// (docs/venue): 12 round tables (rows 1 and 3 of the six staggered columns), dance floor top
// centre, bars along the bottom wall. Each entry is a column's first-row y in floorplan pixels (the columns are
// staggered); columns are evenly spaced so seat names stay readable.
const VENUE_COLUMNS = [303, 362, 406, 372, 407, 359]

export function venueTables() {
  const tables = []
  VENUE_COLUMNS.forEach((fy, c) => {
    ;[0, 2].forEach(r => {
      const n = tables.length + 1
      tables.push({
        id: `tbl_v${String(n).padStart(2, '0')}`,
        shape: 'round',
        name: `Table ${n}`,
        seats: Math.max(8, TABLE_LIST[n - 1].length),
        x: 200 + c * 245,
        y: Math.round(fy * 2.15 - 355 + r * 205),
      })
    })
  })
  const block = (id, name, x, y, w, h) => ({ id: `blk_${id}`, shape: 'block', name, seats: 0, x, y, w, h })
  return [
    block('dance', 'Dance Floor', 935, 242, 310, 185),
    block('foh', 'Scene Change · FOH', 125, 174, 150, 44),
    block('dj', 'DJ · AV', 1440, 215, 190, 64),
    block('photo', 'Photo Booth', 135, 930, 130, 110),
    block('gift', 'Gift Table', 560, 1045, 130, 34),
    block('bar1', 'Bar', 1170, 1045, 96, 34),
    block('bar2', 'Bar', 1272, 1045, 96, 34),
    block('bar3', 'Bar', 1374, 1045, 96, 34),
    ...tables,
  ]
}

export function venuePlan() {
  return { ...emptyPlan(), subtitle: 'Rumman & Esther · 12 December 2026', tables: venueTables() }
}

function lev(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = cur
    }
  }
  return row[b.length]
}

// First real name, folded so common spelling variants collide (Mercy/Mercie, Sooja/Suja, Shafi/Shafee).
const firstToken = name => {
  const t = String(name).toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(t => t && !['dr', 'mr', 'mrs', 'ms', 'prof'].includes(t))[0] || ''
  return t.replace(/ee|ie|y/g, 'i').replace(/oo/g, 'u').replace(/ph/g, 'f').replace(/th/g, 't').replace(/ck/g, 'k').replace(/w/g, 'v').replace(/h/g, '').replace(/(.)\1+/g, '$1')
}

// Seat TABLE_LIST onto tables 1..12. The database spelling always wins: each listed
// first name is matched to the closest unclaimed guest (small typo tolerance), and
// the guest's own record is what gets seated. Anything with no match (children,
// partners, unknown names) is added as a hand-added guest so nobody is dropped.
export function seatFromList(plan, guests) {
  const keep = plan.customGuests.filter(g => !g.id.startsWith('cgl_'))
  const assignments = Object.fromEntries(Object.entries(plan.assignments).filter(([id]) => !id.startsWith('cgl_')))
  const pool = guests.filter(g => g.attending !== false)
  const claimed = new Set()
  const result = {} // `${t}:${i}` -> guest id
  const custom = []

  const candidates = (name, level) => {
    if (/^(child|partner)|partner$/i.test(name.trim())) return []
    const key = firstToken(name)
    const tol = key.length >= 7 ? 2 : key.length >= 4 ? 1 : 0
    return pool
      .filter(g => !claimed.has(g.id))
      .map(g => ({ g, d: lev(key, firstToken(g.name)) }))
      .filter(c => c.d <= Math.min(tol, level))
  }
  const slots = TABLE_LIST.flatMap((names, t) => names.map((name, i) => ({ t, i, name })))

  // Closest spellings claim first (exact, then 1 off, then 2 off). Within a level: names with
  // exactly one possible guest go first, then the rest prefer a guest from the same household
  // as someone already at that table (resolves repeat names like Anil).
  for (const [level, pass] of [[0, 1], [0, 2], [1, 1], [1, 2], [2, 1], [2, 2]]) {
    for (const slot of slots) {
      const k = `${slot.t}:${slot.i}`
      if (result[k]) continue
      const cands = candidates(slot.name, level)
      if (!cands.length || (pass === 1 && cands.length > 1)) continue
      const mates = new Set(
        slots.filter(o => o.t === slot.t && result[`${o.t}:${o.i}`]).map(o => pool.find(g => g.id === result[`${o.t}:${o.i}`])?.household),
      )
      cands.sort((x, y) => x.d - y.d || Number(mates.has(y.g.household)) - Number(mates.has(x.g.household)))
      result[k] = cands[0].g.id
      claimed.add(cands[0].g.id)
    }
  }

  slots.forEach(slot => {
    const k = `${slot.t}:${slot.i}`
    if (!result[k]) {
      const id = `cgl_${slot.t + 1}_${slot.i}`
      custom.push({ id, name: slot.name })
      result[k] = id
    }
  })

  const tables = plan.tables.filter(t => /^tbl_v\d+$/.test(t.id))
  const next = { ...plan, customGuests: [...keep, ...custom], assignments }
  // Clear anyone listed so they are not seated twice, then seat in order.
  Object.values(result).forEach(id => delete next.assignments[id])
  let out = next
  slots.forEach(slot => {
    const table = tables[slot.t]
    if (table) out = assign(out, result[`${slot.t}:${slot.i}`], table.id, slot.i)
  })
  return { plan: out, matched: slots.length - custom.length, custom: custom.map(c => c.name) }
}

// Re-space the seated tables evenly over the floor that is actually free.
// Layout rules, from event-planning and fire-code guidance:
//  - walkways of ~1.8 m (6 ft) edge to edge between tables, wider at bars and the dance floor;
//  - tables ringed around the dance floor so guests are drawn in, never boxed behind it;
//  - queue space in front of bars and the gift table, and room round the DJ/AV so no
//    table sits between speakers and floor;
//  - a clear strip along the walls for service and exits.
// It finds the widest staggered (hex), column-staggered or square lattice that fits every
// table outside those keep-out zones, keeps the N points closest to the dance floor, then
// numbers tables in columns from the left. Seats and guests travel with their table.
export function optimizeLayout(plan) {
  const movers = plan.tables.filter(t => t.shape !== 'block')
  const N = movers.length
  if (!N) return plan
  const SX = 235 // sideways room one table needs (seat names sit left and right)
  const SY = 195
  const X0 = 200
  const X1 = PLAN_W - 200
  const Y0 = 265
  const Y1 = 985
  const margin = name => (/dance|stage/i.test(name) ? 130 : /bar|gift/i.test(name) ? 105 : /dj|av/i.test(name) ? 110 : 90)
  const blocks = plan.tables
    .filter(t => t.shape === 'block')
    .map(b => {
      const { w, h } = tableSize(b)
      const m = margin(b.name)
      return { x0: b.x - w / 2 - m - 45, x1: b.x + w / 2 + m + 45, y0: b.y - h / 2 - m, y1: b.y + h / 2 + m }
    })
  const floor = plan.tables.find(t => t.shape === 'block' && /dance|stage/i.test(t.name))
  const cx = floor ? floor.x : PLAN_W / 2
  const cy = floor ? floor.y : 600
  const ok = (x, y) => x >= X0 && x <= X1 && y >= Y0 && y <= Y1 && !blocks.some(b => x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1)

  const lattice = (s, kind, fx, fy) => {
    const du = kind === 'cols' ? s * 0.866 : s
    const dv = kind === 'rows' ? s * 0.866 : s
    const pts = []
    const cols = Math.ceil(X1 / SX / du) + 2
    const rows = Math.ceil(Y1 / SY / dv) + 2
    for (let i = -1; i < cols; i++) {
      for (let j = -1; j < rows; j++) {
        const u = (fx + i) * du + (kind === 'rows' && j % 2 ? du / 2 : 0)
        const v = (fy + j) * dv + (kind === 'cols' && i % 2 ? dv / 2 : 0)
        const x = u * SX + X0
        const y = v * SY + Y0
        if (ok(x, y)) pts.push({ x, y })
      }
    }
    return pts
  }
  const dist = (p, q) => Math.hypot((p.x - q.x) / SX, (p.y - q.y) / SY)
  const fromCentre = p => Math.hypot((p.x - cx) / SX, (p.y - cy) / SY)
  const nearest = (p, pts) => Math.min(...pts.filter(q => q !== p).map(q => dist(p, q)))
  // Trim a lattice down to N tables by repeatedly dropping the one crowding a neighbour most.
  const trim = pts => {
    let out = pts
    while (out.length > N) {
      let worst = 0
      let worstD = Infinity
      out.forEach((p, i) => {
        const d = nearest(p, out)
        if (d < worstD) {
          worstD = d
          worst = i
        }
      })
      out = out.filter((_, i) => i !== worst)
    }
    return out
  }

  const unevenness = pts => {
    const d = pts.map(p => nearest(p, pts))
    const mean = d.reduce((x, y) => x + y, 0) / d.length
    return { min: Math.min(...d), spread: Math.sqrt(d.reduce((x, y) => x + (y - mean) ** 2, 0) / d.length) }
  }
  const score = pts => {
    if (pts.length < 2) return 0
    const { min, spread } = unevenness(pts)
    return min * 100 - spread * 60 - pts.reduce((sum, p) => sum + fromCentre(p), 0) / pts.length
  }

  // Candidate A: evenly spaced rows. Free stretches of each row (outside keep-outs) get tables
  // in proportion to their length, evenly spaced inside each stretch.
  const rowsLayout = R => {
    const slots = []
    for (let r = 0; r < R; r++) {
      const y = R === 1 ? (Y0 + Y1) / 2 : Y0 + ((Y1 - Y0) * r) / (R - 1)
      let free = [[X0, X1]]
      blocks
        .filter(b => y > b.y0 && y < b.y1)
        .forEach(b => {
          free = free.flatMap(([a, c]) => (b.x1 <= a || b.x0 >= c ? [[a, c]] : [[a, Math.min(c, b.x0)], [Math.max(a, b.x1), c]]))
        })
      free.filter(([a, c]) => c - a >= SX * 0.9).forEach(([a, c]) => slots.push({ y, a, len: c - a, cap: Math.max(1, Math.floor((c - a) / SX)), n: 0 }))
    }
    if (slots.reduce((sum, t) => sum + t.cap, 0) < N) return null
    const total = slots.reduce((sum, t) => sum + t.len, 0)
    slots.forEach(t => {
      t.n = Math.min(t.cap, Math.floor((N * t.len) / total))
    })
    while (slots.reduce((sum, t) => sum + t.n, 0) < N) {
      const open = slots.filter(t => t.n < t.cap).sort((m, n) => (N * n.len) / total - n.n - ((N * m.len) / total - m.n))
      open[0].n++
    }
    return slots.flatMap(t => Array.from({ length: t.n }, (_, k) => ({ x: t.a + ((k + 0.5) * t.len) / t.n, y: t.y })))
  }

  // Candidate B: the widest staggered lattice that fits.
  const latticeLayout = () => {
    for (let s = 2.2; s >= 0.5; s -= 0.01) {
      let best = null
      let bestScore = -Infinity
      for (const kind of ['rows', 'cols', 'square']) {
        for (let a = 0; a < 6; a++) {
          for (let b = 0; b < 6; b++) {
            const pts = lattice(s, kind, a / 6, b / 6)
            if (pts.length < N) continue
            const keep = trim(pts)
            const sc = score(keep)
            if (sc > bestScore) {
              bestScore = sc
              best = keep
            }
          }
        }
      }
      if (best) return best
    }
    return null
  }

  let found = null
  let foundScore = -Infinity
  ;[...[2, 3, 4, 5].map(rowsLayout), latticeLayout()].forEach(pts => {
    if (!pts || pts.length !== N) return
    const sc = score(pts)
    if (sc > foundScore) {
      foundScore = sc
      found = { s: Math.min(...pts.map(p => nearest(p, pts))), pts }
    }
  })
  if (!found) return plan

  // Number in columns, left to right, top to bottom.
  const pts = [...found.pts].sort((p, q) => p.x - q.x)
  const columns = []
  pts.forEach(p => {
    const col = columns[columns.length - 1]
    if (col && p.x - col[0].x < SX * found.s * 0.35) col.push(p)
    else columns.push([p])
  })
  const ordered = columns.flatMap(col => col.sort((p, q) => p.y - q.y))
  let k = 0
  return {
    ...plan,
    tables: plan.tables.map(t => (t.shape === 'block' ? t : { ...t, x: Math.round(ordered[k].x), y: Math.round(ordered[k++].y) })),
  }
}

// Swap in the venue layout, keeping title, extra guests and any seats that still exist.
export function applyVenueLayout(plan) {
  return pruneAssignments({ ...plan, tables: venueTables() })
}

export function newId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`
}

export function tableSize(table) {
  if (table.shape === 'round') {
    const r = 40 + Math.max(0, table.seats - 8) * 4
    return { w: r * 2, h: r * 2, r }
  }
  if (table.shape === 'rect') {
    const perSide = Math.max(1, Math.ceil(table.seats / 2))
    return { w: perSide * 46 + 24, h: 74 }
  }
  return { w: table.w || 220, h: table.h || 120 }
}

// Seat centres plus an outward direction used to place name labels.
export function seatPositions(table) {
  const out = []
  if (table.shape === 'round') {
    const { r } = tableSize(table)
    const sr = r + 22
    for (let i = 0; i < table.seats; i++) {
      const a = (i / table.seats) * Math.PI * 2 - Math.PI / 2
      out.push({ i, x: table.x + Math.cos(a) * sr, y: table.y + Math.sin(a) * sr, dx: Math.cos(a), dy: Math.sin(a) })
    }
  } else if (table.shape === 'rect') {
    const { w, h } = tableSize(table)
    const top = Math.ceil(table.seats / 2)
    const bottom = table.seats - top
    const row = (count, y, dy, offset) => {
      for (let k = 0; k < count; k++) {
        const x = table.x - w / 2 + 12 + (w - 24) * ((k + 0.5) / count)
        out.push({ i: offset + k, x, y, dx: 0, dy })
      }
    }
    row(top, table.y - h / 2 - 24, -1, 0)
    row(bottom, table.y + h / 2 + 24, 1, top)
  }
  return out
}

export function clampTable(table) {
  const { w, h } = tableSize(table)
  const block = table.shape === 'block'
  const pad = block ? 20 : 120
  return {
    ...table,
    x: Math.min(PLAN_W - Math.min(pad, w / 2 + 80), Math.max(Math.min(pad, w / 2 + 80), table.x)),
    y: block
      ? Math.min(PLAN_H - 60, Math.max(HEADER_H + h / 2 + 10, table.y))
      : Math.min(PLAN_H - 110, Math.max(HEADER_H + h / 2 + 50, table.y)),
  }
}

export function makeTable(plan, shape, seats = 10, id = newId('tbl')) {
  const n = plan.tables.filter(t => t.shape !== 'block').length + 1
  const index = plan.tables.length
  const base = {
    id,
    shape,
    name: shape === 'block' ? 'Dance Floor' : `Table ${n}`,
    seats: shape === 'block' ? 0 : seats,
    x: 220 + (index % 4) * 350,
    y: 330 + Math.floor(index / 4) * 330,
    ...(shape === 'block' ? { w: 260, h: 140 } : {}),
  }
  return clampTable(base)
}

export function occupantsByTable(plan) {
  const map = {}
  Object.entries(plan.assignments).forEach(([guestId, a]) => {
    ;(map[a.tableId] ||= {})[a.seat] = guestId
  })
  return map
}

export function assign(plan, guestId, tableId, seat) {
  const occ = occupantsByTable(plan)
  const target = plan.tables.find(t => t.id === tableId)
  if (!target || target.shape === 'block') return plan
  const assignments = { ...plan.assignments }
  const from = assignments[guestId]
  let seatIndex = seat
  if (seatIndex == null) {
    seatIndex = Array.from({ length: target.seats }, (_, i) => i).find(i => !(occ[tableId] || {})[i])
    if (seatIndex == null) return plan
  }
  const displaced = (occ[tableId] || {})[seatIndex]
  if (displaced === guestId) return plan
  if (displaced) {
    if (from) assignments[displaced] = from // swap
    else delete assignments[displaced]
  }
  assignments[guestId] = { tableId, seat: seatIndex }
  return { ...plan, assignments }
}

export function unassign(plan, guestId) {
  const assignments = { ...plan.assignments }
  delete assignments[guestId]
  return { ...plan, assignments }
}

// Drop assignments whose table or seat no longer exists.
export function pruneAssignments(plan) {
  const assignments = {}
  Object.entries(plan.assignments).forEach(([guestId, a]) => {
    const t = plan.tables.find(x => x.id === a.tableId)
    if (t && a.seat < t.seats) assignments[guestId] = a
  })
  return { ...plan, assignments }
}

// Fill free seats table by table, keeping each household together where a table has room.
export function autoSeat(plan, guests) {
  let next = pruneAssignments(plan)
  const pending = guests.filter(g => !next.assignments[g.id])
  const byHousehold = new Map()
  pending.forEach(g => {
    const list = byHousehold.get(g.household) || []
    list.push(g)
    byHousehold.set(g.household, list)
  })
  const households = [...byHousehold.values()].sort((a, b) => b.length - a.length)
  const seated = plan.tables.filter(t => t.shape !== 'block')
  households.forEach(members => {
    let queue = members
    while (queue.length) {
      const occ = occupantsByTable(next)
      const free = t => Array.from({ length: t.seats }, (_, i) => i).filter(i => !(occ[t.id] || {})[i])
      const fit = seated.find(t => free(t).length >= queue.length)
      const table = fit || seated.find(t => free(t).length > 0)
      if (!table) return
      const slots = free(table)
      const take = queue.slice(0, slots.length)
      take.forEach((g, k) => {
        next = assign(next, g.id, table.id, slots[k])
      })
      queue = queue.slice(take.length)
    }
  })
  return next
}

export function guestLine(guest) {
  return guest ? guest.name : ''
}

// ---------- export ----------

export function svgToCanvas(svgMarkup, width, height, scale = 2) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }))
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#FAF6F0'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not render the seating plan.'))
    }
    img.src = url
  })
}

export function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// Minimal PDF writer: one full-bleed JPEG per page (A3 landscape, 1190.55 x 841.89 pt).
export async function buildPdf(canvases, quality = 0.93) {
  const PW = 1190.55
  const PH = 841.89
  const enc = new TextEncoder()
  const chunks = []
  const offsets = []
  let length = 0
  const push = data => {
    const bytes = typeof data === 'string' ? enc.encode(data) : data
    chunks.push(bytes)
    length += bytes.length
  }
  const startObj = n => {
    offsets[n] = length
    push(`${n} 0 obj\n`)
  }

  const jpegs = []
  for (const canvas of canvases) {
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality)
    jpegs.push({ bytes: new Uint8Array(await blob.arrayBuffer()), w: canvas.width, h: canvas.height })
  }

  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n')
  const pageCount = jpegs.length
  // Object layout: 1 catalog, 2 pages, then per page: page, content, image
  const pageObjIds = jpegs.map((_, i) => 3 + i * 3)
  startObj(1)
  push('<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  startObj(2)
  push(`<< /Type /Pages /Count ${pageCount} /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] >>\nendobj\n`)
  jpegs.forEach((jpg, i) => {
    const pageId = 3 + i * 3
    const contentId = pageId + 1
    const imageId = pageId + 2
    startObj(pageId)
    push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>\nendobj\n`)
    const content = `q ${PW} 0 0 ${PH} 0 0 cm /Im0 Do Q`
    startObj(contentId)
    push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`)
    startObj(imageId)
    push(`<< /Type /XObject /Subtype /Image /Width ${jpg.w} /Height ${jpg.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.bytes.length} >>\nstream\n`)
    push(jpg.bytes)
    push('\nendstream\nendobj\n')
  })
  const total = 3 + pageCount * 3
  const xrefAt = length
  push(`xref\n0 ${total}\n0000000000 65535 f \n`)
  for (let n = 1; n < total; n++) push(`${String(offsets[n]).padStart(10, '0')} 00000 n \n`)
  push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xrefAt}\n%%EOF`)
  return new Blob(chunks, { type: 'application/pdf' })
}
