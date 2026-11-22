export const eventLabels = {
  sangeet: 'Sangeet',
  ceremony: 'Ceremony',
  reception: 'Reception',
  portMacquarieReception: 'Port Reception',
}

export function isAnswered(value) {
  return value === true || value === false
}

export function responseText(value) {
  if (value === true) return 'Attending'
  if (value === false) return 'Not attending'
  return 'Awaiting response'
}

export function groupStatus(group) {
  if (group.summary?.status) return group.summary.status
  const guests = group.guests || []
  if (!guests.length) return 'empty'
  const allAnswered = guests.every(guest =>
    (guest.sangeetInvited === false || isAnswered(guest.sangeetAttending)) &&
    (guest.ceremonyInvited === false || isAnswered(guest.ceremonyAttending)) &&
    (guest.receptionInvited === false || isAnswered(guest.receptionAttending)) &&
    (guest.portMacquarieReceptionInvited === false || isAnswered(guest.portMacquarieReceptionAttending))
  )
  if (allAnswered) return 'complete'
  const someAnswered = guests.some(guest =>
    isAnswered(guest.sangeetAttending) || isAnswered(guest.ceremonyAttending) || isAnswered(guest.receptionAttending) || isAnswered(guest.portMacquarieReceptionAttending)
  )
  return someAnswered ? 'partial' : 'pending'
}

export function rsvpCounts(groups) {
  const initial = {
    households: groups.length,
    totalGuestCapacity: 0,
    namedGuests: 0,
    additionalSpots: 0,
    submittedAdditionalGuests: 0,
    pendingHouseholds: 0,
    completeHouseholds: 0,
    sangeetYes: 0,
    ceremonyYes: 0,
    receptionYes: 0,
    portMacquarieReceptionYes: 0,
    sangeetNo: 0,
    ceremonyNo: 0,
    receptionNo: 0,
    portMacquarieReceptionNo: 0,
    children: 0,
  }

  return groups.reduce((counts, group) => {
    const status = groupStatus(group)
    const guests = group.guests || []
    const namedGuestCount = guests
      .filter(guest => !guest.isAdditional)
      .reduce((total, guest) => total + Number(guest.adultCount || 1), 0)
    const submittedAdditionalGuests = guests.filter(guest => guest.isAdditional).length
    const additionalSpots = Number(group.plusOneLimit || 0)
    counts.namedGuests += namedGuestCount
    counts.additionalSpots += additionalSpots
    counts.submittedAdditionalGuests += submittedAdditionalGuests
    counts.totalGuestCapacity += namedGuestCount + additionalSpots
    if (status === 'complete') counts.completeHouseholds += 1
    if (status === 'pending' || status === 'partial') counts.pendingHouseholds += 1
    // Read-only logins get blanked guests plus a server-computed summary, so trust the summary when present.
    if (group.summary) {
      Object.keys(counts).forEach(key => {
        if (/(Yes|No)$/.test(key) || key === 'children') counts[key] += Number(group.summary[key] || 0)
      })
      return counts
    }
    // Count yes/no only for events the guest is actually invited to (some guests carry a stale reply for an event they were later removed from).
    guests.forEach(guest => {
      const tally = (invited, answer, yesKey, noKey) => {
        if (!invited) return
        if (answer === true) counts[yesKey] += 1
        if (answer === false) counts[noKey] += 1
      }
      tally(guest.sangeetInvited !== false, guest.sangeetAttending, 'sangeetYes', 'sangeetNo')
      tally(guest.ceremonyInvited !== false, guest.ceremonyAttending, 'ceremonyYes', 'ceremonyNo')
      tally(guest.receptionInvited !== false, guest.receptionAttending, 'receptionYes', 'receptionNo')
      tally(guest.portMacquarieReceptionInvited === true, guest.portMacquarieReceptionAttending, 'portMacquarieReceptionYes', 'portMacquarieReceptionNo')
    })
    counts.children += group.summary ? Number(group.summary.children || 0) : guests.reduce((total, guest) => total + Number(guest.childrenCount || 0), 0)
    return counts
  }, initial)
}

export function blankGuest() {
  return {
    name: '',
    isPartner: false,
    isAdditional: false,
    childrenAllowed: false,
    maxChildren: 0,
    childrenCount: 0,
    ceremonyChildrenCount: 0,
    receptionChildrenCount: 0,
    sangeetAttending: null,
    ceremonyAttending: null,
    receptionAttending: null,
    portMacquarieReceptionAttending: null,
    sangeetInvited: true,
    ceremonyInvited: true,
    receptionInvited: true,
    portMacquarieReceptionInvited: false,
  }
}
