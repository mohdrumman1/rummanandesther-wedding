export const eventLabels = {
  sangeet: 'Sangeet',
  ceremony: 'Ceremony & Reception',
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
  const guests = group.guests || []
  if (!guests.length) return 'empty'
  const allAnswered = guests.every(guest =>
    isAnswered(guest.sangeetAttending) && isAnswered(guest.ceremonyAttending)
  )
  if (allAnswered) return 'complete'
  const someAnswered = guests.some(guest =>
    isAnswered(guest.sangeetAttending) || isAnswered(guest.ceremonyAttending)
  )
  return someAnswered ? 'partial' : 'pending'
}

export function rsvpCounts(groups) {
  const initial = {
    households: groups.length,
    pendingHouseholds: 0,
    completeHouseholds: 0,
    sangeetYes: 0,
    ceremonyYes: 0,
    sangeetNo: 0,
    ceremonyNo: 0,
    children: 0,
  }

  return groups.reduce((counts, group) => {
    const status = groupStatus(group)
    if (status === 'complete') counts.completeHouseholds += 1
    if (status === 'pending' || status === 'partial') counts.pendingHouseholds += 1
    group.guests.forEach(guest => {
      if (guest.sangeetAttending === true) counts.sangeetYes += 1
      if (guest.ceremonyAttending === true) counts.ceremonyYes += 1
      if (guest.sangeetAttending === false) counts.sangeetNo += 1
      if (guest.ceremonyAttending === false) counts.ceremonyNo += 1
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
    sangeetAttending: null,
    ceremonyAttending: null,
  }
}
