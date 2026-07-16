export const eventLabels = {
  sangeet: 'Sangeet',
  ceremony: 'Ceremony',
  reception: 'Reception',
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
    (guest.receptionInvited === false || isAnswered(guest.receptionAttending))
  )
  if (allAnswered) return 'complete'
  const someAnswered = guests.some(guest =>
    isAnswered(guest.sangeetAttending) || isAnswered(guest.ceremonyAttending) || isAnswered(guest.receptionAttending)
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
    sangeetNo: 0,
    ceremonyNo: 0,
    receptionNo: 0,
    children: 0,
  }

  return groups.reduce((counts, group) => {
    const status = groupStatus(group)
    const guests = group.guests || []
    const namedGuestCount = guests.filter(guest => !guest.isAdditional).length
    const submittedAdditionalGuests = guests.filter(guest => guest.isAdditional).length
    const additionalSpots = Number(group.plusOneLimit || 0)
    counts.namedGuests += namedGuestCount
    counts.additionalSpots += additionalSpots
    counts.submittedAdditionalGuests += submittedAdditionalGuests
    counts.totalGuestCapacity += namedGuestCount + additionalSpots
    if (status === 'complete') counts.completeHouseholds += 1
    if (status === 'pending' || status === 'partial') counts.pendingHouseholds += 1
    if (group.summary) {
      counts.sangeetYes += Number(group.summary.sangeetYes || 0)
      counts.ceremonyYes += Number(group.summary.ceremonyYes || 0)
      counts.receptionYes += Number(group.summary.receptionYes || 0)
      counts.sangeetNo += Number(group.summary.sangeetNo || 0)
      counts.ceremonyNo += Number(group.summary.ceremonyNo || 0)
      counts.receptionNo += Number(group.summary.receptionNo || 0)
      counts.children += Number(group.summary.children || 0)
      return counts
    }
    group.guests.forEach(guest => {
      if (guest.sangeetAttending === true) counts.sangeetYes += 1
      if (guest.ceremonyAttending === true) counts.ceremonyYes += 1
      if (guest.receptionAttending === true) counts.receptionYes += 1
      if (guest.sangeetAttending === false) counts.sangeetNo += 1
      if (guest.ceremonyAttending === false) counts.ceremonyNo += 1
      if (guest.receptionAttending === false) counts.receptionNo += 1
      counts.children += Number(guest.childrenCount || 0)
    })
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
    sangeetInvited: true,
    ceremonyInvited: true,
    receptionInvited: true,
  }
}
