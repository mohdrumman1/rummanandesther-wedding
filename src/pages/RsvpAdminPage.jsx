import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import {
  adminLogin,
  buildInviteLink,
  clearAdminToken,
  createAdminGroup,
  deleteAdminGroup,
  exportAdminCsv,
  fetchAdminGroups,
  getAdminUser,
  getAdminToken,
  importAdminCsv,
  updateAdminGroup,
} from '../lib/rsvpApi'
import { blankGuest, groupStatus, rsvpCounts } from '../lib/rsvpUtils'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const inputClass =
  'w-full bg-white border border-gold/25 text-ink font-sans text-[14px] font-light px-4 py-3 focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-ink/30'

const labelClass = 'block font-sans text-[10px] tracking-extreme uppercase text-ink/50 mb-2'

function statusLabel(status) {
  if (status === 'complete') return 'Complete'
  if (status === 'partial') return 'Partial'
  if (status === 'empty') return 'No guests'
  return 'Pending'
}

function statusClass(status) {
  if (status === 'complete') return 'border-green-700/30 text-green-800 bg-green-50'
  if (status === 'partial') return 'border-gold/40 text-gold-dark bg-gold/10'
  if (status === 'empty') return 'border-ink/10 text-ink/45 bg-ink/5'
  return 'border-burgundy/20 text-burgundy bg-burgundy/5'
}

function LoginPanel({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await adminLogin({ username: username.trim(), password })
      onLogin()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-160px)] overflow-hidden bg-cream px-6 py-16 md:py-24">
      <div
        className="absolute inset-0 bg-[url('/images/welcome.jpg')] bg-cover bg-center opacity-[0.14]"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(250,246,240,0.92),rgba(250,246,240,0.98))]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_440px]">
        <div className="hidden md:block">
          <p className="font-sans text-[10px] uppercase tracking-extreme text-gold-dark">Private dashboard</p>
          <h1 className="mt-5 max-w-xl font-serif text-6xl font-light leading-[0.95] text-ink">
            Rumman & Esther
          </h1>
          <div className="mt-8 h-px w-32 bg-gold/50" />
          <p className="mt-6 max-w-md font-sans text-[15px] font-light leading-7 text-ink/55">
            RSVPs, invite links, household notes, and family responses.
          </p>
        </div>

        <form onSubmit={submit} className="border border-gold/25 bg-white/95 p-7 shadow-[0_24px_80px_rgba(42,31,26,0.10)] backdrop-blur md:p-9">
          <div className="text-center">
            <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-gold/35 text-gold">◆</span>
            <p className="font-sans text-[10px] uppercase tracking-extreme text-ink/35">RSVP Admin</p>
            <h2 className="mt-3 font-serif text-4xl font-light text-ink">Welcome Back</h2>
          </div>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="adminUsername" className={labelClass}>Username</label>
              <input
                id="adminUsername"
                type="text"
                value={username}
                onChange={event => setUsername(event.target.value)}
                className={`${inputClass} border-gold/30 bg-cream/35 focus:bg-white`}
                autoComplete="username"
                placeholder="admin"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className={labelClass}>Password</label>
              <input
                id="adminPassword"
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className={`${inputClass} border-gold/30 bg-cream/35 focus:bg-white`}
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="mt-5 border border-burgundy/20 bg-burgundy/5 px-4 py-3 text-center font-sans text-[13px] text-burgundy">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-6 w-full bg-burgundy py-4 font-sans text-[10px] uppercase tracking-extreme text-white transition-colors duration-200 hover:bg-burgundy-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Opening...' : 'Open Dashboard'}
          </button>

          <div className="mt-6 flex items-center justify-center gap-3 border-t border-gold/20 pt-5 font-sans text-[11px] uppercase tracking-ultra text-ink/35">
            <span className="h-1.5 w-1.5 bg-gold" />
            Secure invite access
          </div>
        </form>
      </div>
    </section>
  )
}

function GuestEditor({ guests, setGuests }) {
  function updateGuest(index, patch) {
    setGuests(guests.map((guest, itemIndex) => itemIndex === index ? { ...guest, ...patch } : guest))
  }

  function removeGuest(index) {
    setGuests(guests.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="space-y-3">
      {guests.map((guest, index) => (
        <div key={guest.id || index} className="border border-gold/20 bg-cream p-4 space-y-3">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={guest.name}
              onChange={event => updateGuest(index, { name: event.target.value })}
              placeholder="Guest name"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => removeGuest(index)}
              className="font-sans text-[10px] tracking-ultra uppercase text-burgundy px-3"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.isPartner || false}
                onChange={event => updateGuest(index, { isPartner: event.target.checked, isAdditional: false })}
                className="accent-burgundy"
              />
              Partner/spouse
            </label>
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.isAdditional || false}
                onChange={event => updateGuest(index, { isAdditional: event.target.checked, isPartner: false })}
                className="accent-burgundy"
              />
              Additional guest
            </label>
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.childrenAllowed || false}
                onChange={event => updateGuest(index, {
                  childrenAllowed: event.target.checked,
                  maxChildren: event.target.checked ? Math.max(1, guest.maxChildren || 1) : 0,
                  childrenCount: event.target.checked ? guest.childrenCount || 0 : 0,
                  ceremonyChildrenCount: event.target.checked ? guest.ceremonyChildrenCount || 0 : 0,
                  receptionChildrenCount: event.target.checked ? guest.receptionChildrenCount || 0 : 0,
                })}
                className="accent-burgundy"
              />
              Can bring children
            </label>
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.sangeetInvited !== false}
                onChange={event => updateGuest(index, { sangeetInvited: event.target.checked })}
                className="accent-burgundy"
              />
              Invited to Sangeet
            </label>
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.ceremonyInvited !== false}
                onChange={event => updateGuest(index, { ceremonyInvited: event.target.checked })}
                className="accent-burgundy"
              />
              Invited to Ceremony
            </label>
            <label className="flex items-center gap-2 font-sans text-[12px] text-ink/60">
              <input
                type="checkbox"
                checked={guest.receptionInvited !== false}
                onChange={event => updateGuest(index, { receptionInvited: event.target.checked })}
                className="accent-burgundy"
              />
              Invited to Reception
            </label>
          </div>
          {guest.childrenAllowed && (
            <div className="max-w-xs">
              <label className={labelClass}>Max children</label>
              <input
                type="number"
                min="0"
                max="8"
                value={guest.maxChildren || 0}
                onChange={event => updateGuest(index, { maxChildren: Number(event.target.value) })}
                className={inputClass}
              />
            </div>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => setGuests([...guests, blankGuest()])}
        className="w-full border border-gold/30 bg-white px-5 py-4 font-sans text-[10px] tracking-extreme uppercase text-ink hover:border-gold"
      >
        Add Guest
      </button>
    </div>
  )
}

function GroupForm({ activeGroup, onSave, onCancel }) {
  const [householdName, setHouseholdName] = useState(activeGroup?.householdName || '')
  const [plusOneLimit, setPlusOneLimit] = useState(activeGroup?.plusOneLimit || 0)
  const [notes, setNotes] = useState(activeGroup?.notes || '')
  const [guests, setGuests] = useState(activeGroup?.guests?.length ? activeGroup.guests.map(guest => ({ ...guest })) : [blankGuest()])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    const cleanedGuests = guests
      .map(guest => ({ ...guest, name: guest.name.trim().replace(/\s+/g, ' ') }))
      .filter(guest => guest.name)
    if (!householdName.trim()) {
      setError('Household name is required.')
      return
    }
    if (!cleanedGuests.length) {
      setError('Add at least one guest.')
      return
    }
    setLoading(true)
    try {
      const payload = {
        householdName,
        plusOneLimit: Number(plusOneLimit || 0),
        notes,
        guests: cleanedGuests,
      }
      if (activeGroup?.id) await updateAdminGroup(activeGroup.id, payload)
      else await createAdminGroup(payload)
      onSave()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="border border-gold/25 bg-white p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-serif text-3xl font-light text-ink">
          {activeGroup ? 'Edit Household' : 'Add Household'}
        </h2>
        {activeGroup && (
          <button type="button" onClick={onCancel} className="font-sans text-[10px] tracking-ultra uppercase text-ink/50">
            Cancel
          </button>
        )}
      </div>
      <div className="grid gap-5 md:grid-cols-[1fr_180px]">
        <div>
          <label className={labelClass}>Household name</label>
          <input
            value={householdName}
            onChange={event => setHouseholdName(event.target.value)}
            placeholder="Ahmed Family"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Plus-one limit</label>
          <input
            type="number"
            min="0"
            max="10"
            value={plusOneLimit}
            onChange={event => setPlusOneLimit(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
      <div>
        <label className={labelClass}>Admin notes</label>
        <input
          value={notes}
          onChange={event => setNotes(event.target.value)}
          placeholder="Optional notes for you"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Guests</label>
        <GuestEditor guests={guests} setGuests={setGuests} />
      </div>
      {error && <p className="font-sans text-[13px] text-burgundy">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full font-sans text-[10px] tracking-extreme uppercase bg-burgundy text-white py-4 hover:bg-burgundy-dark disabled:opacity-50"
      >
        {loading ? 'Saving...' : activeGroup ? 'Save Household' : 'Create Household'}
      </button>
    </form>
  )
}

function CsvImport({ onImported }) {
  const [csv, setCsv] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const result = await importAdminCsv(csv)
      setStatus(`Imported ${result.imported} household${result.imported === 1 ? '' : 's'}.`)
      setCsv('')
      onImported()
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="border border-gold/25 bg-white p-6 md:p-8 space-y-5">
      <div>
        <h2 className="font-serif text-3xl font-light text-ink">CSV Import</h2>
        <p className="mt-2 font-sans text-[12px] text-ink/45 font-light leading-relaxed">
          Columns: household, guest, plus_one_limit, partner, children_allowed, max_children, sangeet_invited, ceremony_invited, reception_invited, notes.
        </p>
      </div>
      <textarea
        value={csv}
        onChange={event => setCsv(event.target.value)}
        rows={7}
        placeholder={'household,guest,plus_one_limit,partner,children_allowed,max_children,sangeet_invited,ceremony_invited,reception_invited,notes\nAhmed Family,Amina Ahmed,1,false,true,2,yes,yes,yes,\nAhmed Family,Omar Ahmed,1,true,false,0,yes,yes,yes,'}
        className={`${inputClass} resize-none font-mono text-[12px]`}
      />
      {status && <p className="font-sans text-[13px] text-ink/60">{status}</p>}
      <button
        type="submit"
        disabled={loading || !csv.trim()}
        className="w-full font-sans text-[10px] tracking-extreme uppercase border border-gold/40 px-5 py-4 text-ink hover:border-gold disabled:opacity-40"
      >
        {loading ? 'Importing...' : 'Import CSV'}
      </button>
    </form>
  )
}

function copyInviteMessage(group, inviteLink) {
  return `Hi ${group.householdName},\n\nWe'd love to invite you to our wedding. Please click the link below to RSVP:\n\n${inviteLink}\n\nWith love,\nRumman & Esther`
}

function GroupTable({ groups, filter, onEdit, onDelete, readOnly }) {
  const filtered = groups.filter(group => filter === 'all' || groupStatus(group) === filter)
  const headings = ['Household', 'Status', 'Family Members', 'Sangeet', 'Ceremony', 'Reception']
  if (!readOnly) headings.push('Invite Link')
  if (!readOnly) headings.push('Actions')

  return (
    <div className="border border-gold/25 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="bg-cream border-b border-gold/20">
            <tr>
              {headings.map(label => (
                <th key={label} className="px-4 py-4 font-sans text-[10px] tracking-extreme uppercase text-ink/45">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(group => {
              const status = groupStatus(group)
              const sangeetYes = group.summary?.sangeetYes ?? group.guests.filter(guest => guest.sangeetAttending === true).length
              const ceremonyYes = group.summary?.ceremonyYes ?? group.guests.filter(guest => guest.ceremonyAttending === true).length
              const receptionYes = group.summary?.receptionYes ?? group.guests.filter(guest => guest.receptionAttending === true).length
              const inviteLink = readOnly ? '' : buildInviteLink(group.accessCode)
              return (
                <tr key={group.id} className="border-b border-gold/10 align-top">
                  <td className="px-4 py-5">
                    <p className="font-serif text-xl text-ink">{group.householdName}</p>
                    {!readOnly && <p className="font-sans text-[12px] text-ink/40">{group.accessCode}</p>}
                  </td>
                  <td className="px-4 py-5">
                    <span className={`inline-block border px-3 py-2 font-sans text-[10px] tracking-ultra uppercase ${statusClass(status)}`}>
                      {statusLabel(status)}
                    </span>
                  </td>
                  <td className="px-4 py-5 font-sans text-[13px] text-ink/60">
                    <p>{group.guests.length} guest{group.guests.length === 1 ? '' : 's'}</p>
                    <p className="mt-2 max-w-[220px] text-ink/45">
                      {group.guests.map(guest => guest.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-4 py-5 font-sans text-[13px] text-ink/60">
                    {sangeetYes} yes
                  </td>
                  <td className="px-4 py-5 font-sans text-[13px] text-ink/60">
                    {ceremonyYes} yes
                  </td>
                  <td className="px-4 py-5 font-sans text-[13px] text-ink/60">
                    {receptionYes} yes
                  </td>
                  {!readOnly && <td className="px-4 py-5">
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(copyInviteMessage(group, inviteLink))}
                        className="font-sans text-[10px] tracking-ultra uppercase text-burgundy"
                      >
                        Copy Invite
                      </button>
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(inviteLink)}
                        className="font-sans text-[10px] tracking-ultra uppercase text-ink/60"
                      >
                        Copy Link
                      </button>
                    </div>
                    <p className="mt-2 max-w-[260px] truncate font-sans text-[12px] text-ink/40">{inviteLink}</p>
                  </td>}
                  {!readOnly && (
                    <td className="px-4 py-5">
                      <div className="flex gap-4">
                        <button type="button" onClick={() => onEdit(group)} className="font-sans text-[10px] tracking-ultra uppercase text-ink">
                          Edit
                        </button>
                        <button type="button" onClick={() => onDelete(group)} className="font-sans text-[10px] tracking-ultra uppercase text-burgundy">
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <p className="p-8 text-center font-sans text-[13px] text-ink/45">
          No households match this view.
        </p>
      )}
    </div>
  )
}

export default function RsvpAdminPage() {
  const [authenticated, setAuthenticated] = useState(Boolean(getAdminToken()))
  const [user, setUser] = useState(getAdminUser())
  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const counts = useMemo(() => rsvpCounts(groups), [groups])
  const readOnly = user?.role === 'readonly'

  async function loadGroups() {
    if (!getAdminToken()) return
    setLoading(true)
    setError('')
    try {
      const data = await fetchAdminGroups()
      setGroups(data.groups || [])
      setUser(getAdminUser())
      setAuthenticated(true)
    } catch (err) {
      setError(err.message)
      if (err.message.toLowerCase().includes('login')) {
        clearAdminToken()
        setAuthenticated(false)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) {
      const timer = window.setTimeout(loadGroups, 0)
      return () => window.clearTimeout(timer)
    }
  }, [authenticated])

  async function removeGroup(group) {
    const confirmed = window.confirm(`Delete ${group.householdName} and all RSVP data for this household?`)
    if (!confirmed) return
    await deleteAdminGroup(group.id)
    if (activeGroup?.id === group.id) setActiveGroup(null)
    loadGroups()
  }

  async function downloadExport() {
    const csv = await exportAdminCsv()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'rsvp-export.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function logout() {
    clearAdminToken()
    setAuthenticated(false)
    setUser(null)
    setGroups([])
  }

  if (!authenticated) {
    return <LoginPanel onLogin={() => {
      setUser(getAdminUser())
      setAuthenticated(true)
    }} />
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="RSVP Admin" subtitle="Manage households, invite links, and responses" />
      <section className="py-16 md:py-20 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                ['Households', counts.households],
                ['Complete', counts.completeHouseholds],
                ['Pending', counts.pendingHouseholds],
                ['Sangeet Yes', counts.sangeetYes],
                ['Ceremony Yes', counts.ceremonyYes],
                ['Reception Yes', counts.receptionYes],
              ].map(([label, value]) => (
                <div key={label} className="border border-gold/25 bg-white px-5 py-4">
                  <p className="font-sans text-[10px] tracking-ultra uppercase text-ink/40">{label}</p>
                  <p className="mt-2 font-serif text-3xl font-light text-ink">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={loadGroups}
                disabled={loading}
                className="font-sans text-[10px] tracking-extreme uppercase border border-gold/40 px-5 py-4 text-ink hover:border-gold disabled:opacity-40"
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
              {!readOnly && (
                <button
                  type="button"
                  onClick={downloadExport}
                  className="font-sans text-[10px] tracking-extreme uppercase border border-gold/40 px-5 py-4 text-ink hover:border-gold"
                >
                  Export CSV
                </button>
              )}
              {readOnly && (
                <span className="font-sans text-[10px] tracking-extreme uppercase border border-gold/30 px-5 py-4 text-ink/45">
                  Read Only
                </span>
              )}
              <button
                type="button"
                onClick={logout}
                className="font-sans text-[10px] tracking-extreme uppercase text-ink/45 px-5 py-4"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="border border-burgundy/20 bg-white p-5 font-sans text-[13px] text-burgundy">
              {error}
            </div>
          )}

          <div className={`grid gap-8 ${readOnly ? '' : 'lg:grid-cols-[420px_1fr]'}`}>
            {!readOnly && (
              <div className="space-y-8 lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-4">
                <GroupForm
                  key={activeGroup?.id || 'new-household'}
                  activeGroup={activeGroup}
                  onSave={() => {
                    setActiveGroup(null)
                    loadGroups()
                  }}
                  onCancel={() => setActiveGroup(null)}
                />
                <CsvImport onImported={loadGroups} />
              </div>
            )}

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                {[
                  ['all', 'All'],
                  ['pending', 'Pending'],
                  ['partial', 'Partial'],
                  ['complete', 'Complete'],
                  ['empty', 'No Guests'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`font-sans text-[10px] tracking-ultra uppercase border px-4 py-3 ${
                      filter === value
                        ? 'border-burgundy bg-burgundy text-white'
                        : 'border-gold/30 bg-white text-ink/60 hover:border-gold'
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {loading && (
                  <span className="font-sans text-[11px] tracking-ultra uppercase text-gold">
                    Loading
                  </span>
                )}
              </div>
              <GroupTable
                groups={groups}
                filter={filter}
                onEdit={setActiveGroup}
                onDelete={removeGroup}
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
