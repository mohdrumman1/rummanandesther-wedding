// Pure helpers for the public seat lookup. Kept free of React so they can be
// tested with plain node.
//
// A seat is { name, household, table, seat } where table is the table label
// (the public endpoint only lists seated guests).

export function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/g, 'o').replace(/ł/g, 'l').replace(/ß/g, 'ss').replace(/æ/g, 'ae')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

// Partial, case-insensitive matching: every word the guest types must appear
// somewhere in the guest's name, so "pri", "Priya N" and "NAIR" all find
// "Priya Nair". Returns every match; the caller slices what it shows.
export function findMatches(seats, query) {
  const tokens = normalizeSearchText(query).split(/\s+/).filter(Boolean)
  if (!tokens.length) return []
  return (seats || []).filter(seat => {
    const name = normalizeSearchText(seat.name)
    const squashed = name.replace(/ /g, '') // "dsouza" finds "D'Souza", "annemarie" finds "Anne-Marie"
    if (tokens.every(token => name.includes(token) || squashed.includes(token))) return true
    // Hand-added seats are often first names only: "Saleem Lathif" must still find "Saleem".
    const nameTokens = name.split(' ').filter(Boolean)
    return nameTokens.length > 0 && nameTokens.every(word => tokens.includes(word))
  })
}

// Two guests can share a name and household (e.g. two hand-added "Roshan").
// Collapse them into one entry that lists every table, so the guest is never
// silently sent to the wrong one.
export function groupMatches(matches) {
  const groups = new Map()
  for (const seat of matches) {
    const key = `${normalizeSearchText(seat.name)}|${normalizeSearchText(seat.household)}`
    const group = groups.get(key)
    if (group) {
      if (!group.tableIds.includes(seat.tableId)) {
        group.tables.push(seat.table)
        group.tableIds.push(seat.tableId)
      }
      group.seatKeys.push(`${seat.tableId}:${seat.seat}`)
    } else {
      groups.set(key, { name: seat.name, household: seat.household, tables: [seat.table], tableIds: [seat.tableId], seatKeys: [`${seat.tableId}:${seat.seat}`] })
    }
  }
  return [...groups.values()]
}
