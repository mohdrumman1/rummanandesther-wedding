import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'
import { fetchRsvp, submitRsvp } from '../lib/rsvpApi'
import { isAnswered, responseText } from '../lib/rsvpUtils'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const inputClass =
  'w-full bg-white border border-gold/25 text-ink font-sans text-[14px] font-light px-5 py-4 focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-ink/30'

const labelClass = 'block font-sans text-[10px] tracking-extreme uppercase text-ink/50 mb-2'

function RsvpFallback() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="RSVP" subtitle="Your personal RSVP link is on your invitation" />
      <section className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-gold text-5xl block mb-8">◆</span>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
            Please use your invitation link
          </h2>
          <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed">
            Each household has a personal RSVP link so we can show the right names and details.
            If you cannot find yours, contact us and we will help.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-5">
            <a
              href="tel:+610474199245"
              className="font-sans text-[10px] tracking-extreme uppercase border border-gold/40 px-8 py-4 text-ink hover:border-gold transition-colors"
            >
              Call Rumman
            </a>
            <a
              href="mailto:mohdrumman1@gmail.com?subject=RSVP%20link%20help"
              className="font-sans text-[10px] tracking-extreme uppercase bg-burgundy text-white px-8 py-4 hover:bg-burgundy-dark transition-colors"
            >
              Email for help
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

function LoadingState() {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream min-h-[52vh] flex items-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto h-10 w-10 border border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="mt-8 font-sans text-[10px] tracking-extreme uppercase text-gold">
          Opening your RSVP
        </p>
      </div>
    </section>
  )
}

function ErrorState({ message }) {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream">
      <div className="max-w-2xl mx-auto text-center">
        <span className="text-gold text-5xl block mb-8">◆</span>
        <h2 className="font-serif text-4xl font-light text-ink mb-4">We could not open this link</h2>
        <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed">
          {message || 'Please check the invitation link, or contact us and we will help.'}
        </p>
        <Link
          to="/rsvp"
          className="inline-block mt-10 font-sans text-[10px] tracking-extreme uppercase border border-gold/40 px-8 py-4 text-ink hover:border-gold transition-colors"
        >
          RSVP Help
        </Link>
      </div>
    </section>
  )
}

function AttendanceButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-12 border px-4 font-sans text-[11px] tracking-ultra uppercase transition-colors ${
        selected
          ? 'border-burgundy bg-burgundy text-white'
          : 'border-gold/25 bg-cream text-ink/65 hover:border-gold hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function ChildCounter({ label, count, max, enabled, guestName, onChange }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-3">
        <button type="button" disabled={!enabled || count <= 0} onClick={() => onChange(Math.max(0, count - 1))}
          className="h-11 w-11 border border-gold/25 bg-cream text-ink disabled:opacity-35" aria-label={`Decrease ${label.toLowerCase()} for ${guestName}`}>-</button>
        <span className="w-10 text-center font-serif text-2xl text-ink">{count || 0}</span>
        <button type="button" disabled={!enabled || count >= max} onClick={() => onChange(Math.min(max, count + 1))}
          className="h-11 w-11 border border-gold/25 bg-cream text-ink disabled:opacity-35" aria-label={`Increase ${label.toLowerCase()} for ${guestName}`}>+</button>
        {!enabled && <span className="font-sans text-[12px] text-ink/45 font-light">Select yes for this event to add children.</span>}
      </div>
    </div>
  )
}

function GuestCard({ guest, onChange }) {
  return (
    <div className="border border-gold/25 bg-white p-6 md:p-7 space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-light text-ink">{guest.name}</h3>
          <p className="font-sans text-[12px] text-ink/45 font-light">
            Sangeet: {responseText(guest.sangeetAttending)} · Ceremony: {responseText(guest.ceremonyAttending)} · Reception: {responseText(guest.receptionAttending)}
          </p>
        </div>
        {guest.isAdditional && (
          <span className="self-start font-sans text-[10px] tracking-ultra uppercase text-gold border border-gold/30 px-3 py-2">
            Additional guest
          </span>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className={labelClass}>Sangeet</label>
          <div className="grid grid-cols-2 gap-3">
            <AttendanceButton
              selected={guest.sangeetAttending === true}
              onClick={() => onChange({ ...guest, sangeetAttending: true })}
            >
              Yes
            </AttendanceButton>
            <AttendanceButton
              selected={guest.sangeetAttending === false}
              onClick={() => onChange({ ...guest, sangeetAttending: false })}
            >
              No
            </AttendanceButton>
          </div>
        </div>
        <div>
          <label className={labelClass}>Ceremony</label>
          <div className="grid grid-cols-2 gap-3">
            <AttendanceButton
              selected={guest.ceremonyAttending === true}
              onClick={() => onChange({ ...guest, ceremonyAttending: true })}
            >
              Yes
            </AttendanceButton>
            <AttendanceButton
              selected={guest.ceremonyAttending === false}
              onClick={() => onChange({ ...guest, ceremonyAttending: false, ceremonyChildrenCount: 0 })}
            >
              No
            </AttendanceButton>
          </div>
        </div>
        <div>
          <label className={labelClass}>Reception</label>
          <div className="grid grid-cols-2 gap-3">
            <AttendanceButton
              selected={guest.receptionAttending === true}
              onClick={() => onChange({ ...guest, receptionAttending: true })}
            >
              Yes
            </AttendanceButton>
            <AttendanceButton
              selected={guest.receptionAttending === false}
              onClick={() => onChange({ ...guest, receptionAttending: false, receptionChildrenCount: 0 })}
            >
              No
            </AttendanceButton>
          </div>
        </div>
      </div>

      {guest.childrenAllowed && (
        <div className="pt-5 border-t border-gold/15 grid gap-5 md:grid-cols-2">
          <ChildCounter label="Children attending Ceremony" count={guest.ceremonyChildrenCount || 0}
            max={guest.maxChildren} enabled={guest.ceremonyAttending === true} guestName={guest.name}
            onChange={count => onChange({ ...guest, ceremonyChildrenCount: count })} />
          <ChildCounter label="Children attending Reception" count={guest.receptionChildrenCount || 0}
            max={guest.maxChildren} enabled={guest.receptionAttending === true} guestName={guest.name}
            onChange={count => onChange({ ...guest, receptionChildrenCount: count })} />
        </div>
      )}
    </div>
  )
}

function AdditionalGuestForm({ remaining, pending, setPending }) {
  const [name, setName] = useState('')

  function addGuest() {
    const trimmed = name.trim().replace(/\s+/g, ' ')
    if (!trimmed || pending.length >= remaining) return
    setPending([...pending, {
      name: trimmed,
      sangeetAttending: null,
      ceremonyAttending: null,
      receptionAttending: null,
    }])
    setName('')
  }

  if (remaining <= 0 && pending.length === 0) return null

  return (
    <div className="border border-gold/25 bg-white p-7 space-y-5">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="h-px w-6 bg-gold flex-shrink-0" />
          <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
            Additional Guests
          </span>
        </div>
        <p className="font-sans text-[13px] text-ink/50 font-light mt-3 ml-9">
          {remaining > 0
            ? `You can add ${remaining} more guest${remaining === 1 ? '' : 's'} to this RSVP.`
            : 'No additional guest spots remain.'}
        </p>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          {pending.map((guest, index) => (
            <div key={`${guest.name}-${index}`} className="border border-gold/20 bg-cream p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[13px] text-ink/70">{guest.name}</span>
                <button type="button" onClick={() => setPending(pending.filter((_, itemIndex) => itemIndex !== index))}
                  className="font-sans text-[10px] tracking-ultra uppercase text-burgundy">Remove</button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ['Sangeet', 'sangeetAttending'],
                  ['Ceremony', 'ceremonyAttending'],
                  ['Reception', 'receptionAttending'],
                ].map(([label, field]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <AttendanceButton selected={guest[field] === true} onClick={() => setPending(pending.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: true } : item))}>Yes</AttendanceButton>
                      <AttendanceButton selected={guest[field] === false} onClick={() => setPending(pending.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: false } : item))}>No</AttendanceButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {remaining > pending.length && (
        <div>
          <label htmlFor="additionalGuest" className={labelClass}>Guest name</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="additionalGuest"
              value={name}
              onChange={event => setName(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addGuest()
                }
              }}
              placeholder="Full name"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addGuest}
              disabled={!name.trim()}
              className="sm:w-36 font-sans text-[10px] tracking-extreme uppercase bg-ink text-white px-6 py-4 disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RsvpPage() {
  const { accessCode } = useParams()
  const [group, setGroup] = useState(null)
  const [guests, setGuests] = useState([])
  const [dietaryRequirements, setDietaryRequirements] = useState('')
  const [message, setMessage] = useState('')
  const [pendingAdditional, setPendingAdditional] = useState([])
  const [status, setStatus] = useState(accessCode ? 'loading' : 'idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessCode) return
    let active = true
    fetchRsvp(accessCode)
      .then(data => {
        if (!active) return
        setGroup(data)
        setGuests(data.guests || [])
        setDietaryRequirements(data.rsvp?.dietaryRequirements || '')
        setMessage(data.rsvp?.message || '')
        setStatus('ready')
      })
      .catch(err => {
        if (!active) return
        setError(err.message)
        setStatus('error')
      })
    return () => { active = false }
  }, [accessCode])

  const existingAdditional = useMemo(
    () => guests.filter(guest => guest.isAdditional).length,
    [guests],
  )
  const remainingAdditional = Math.max(0, (group?.plusOneLimit || 0) - existingAdditional)

  if (!accessCode) return <RsvpFallback />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const incomplete = guests.filter(guest =>
      !isAnswered(guest.sangeetAttending) || !isAnswered(guest.ceremonyAttending) || !isAnswered(guest.receptionAttending)
    )
    if (incomplete.length) {
      setError('Please respond yes or no for each guest and each event before submitting.')
      return
    }
    if (pendingAdditional.some(guest =>
      !isAnswered(guest.sangeetAttending) || !isAnswered(guest.ceremonyAttending) || !isAnswered(guest.receptionAttending)
    )) {
      setError('Please respond yes or no for each additional guest and each event before submitting.')
      return
    }
    setStatus('saving')
    try {
      const result = await submitRsvp(accessCode, {
        guests,
        additionalGuests: pendingAdditional,
        dietaryRequirements,
        message,
      })
      setGroup(result.group)
      setGuests(result.group.guests || [])
      setDietaryRequirements(result.group.rsvp?.dietaryRequirements || '')
      setMessage(result.group.rsvp?.message || '')
      setPendingAdditional([])
      setStatus('submitted')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.message)
      setStatus('ready')
    }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="RSVP"
        subtitle={group ? `For ${group.householdName}` : 'Opening your personal RSVP'}
      />

      {status === 'loading' && <LoadingState />}
      {status === 'error' && <ErrorState message={error} />}

      {(status === 'ready' || status === 'saving' || status === 'submitted') && group && (
        <section className="py-20 md:py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-cream">
          <div className="max-w-3xl mx-auto">
            {status === 'submitted' && (
              <motion.div
                className="mb-10 border border-gold/30 bg-white px-6 py-7 text-center"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-gold text-3xl block mb-4">◆</span>
                <h2 className="font-serif text-3xl font-light text-ink mb-2">Thank you</h2>
                <p className="font-sans text-[14px] font-light text-ink/60 leading-relaxed">
                  Your RSVP has been saved. You can return to this same link to make changes before August 15, 2026.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="border border-gold/25 bg-white p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-8 bg-gold flex-shrink-0" />
                  <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
                    Personal RSVP
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-4">
                  {group.householdName}
                </h2>
                <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed">
                  Please respond for each person listed below. If plans change, you can return to this link and update your RSVP.
                </p>
              </div>

              {guests.map(guest => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onChange={updated => setGuests(current =>
                    current.map(item => item.id === updated.id ? updated : item)
                  )}
                />
              ))}

              <AdditionalGuestForm
                remaining={remainingAdditional}
                pending={pendingAdditional}
                setPending={setPendingAdditional}
              />

              <div className="border border-gold/25 bg-white p-7 space-y-6">
                <div>
                  <label htmlFor="dietary" className={labelClass}>Dietary requirements</label>
                  <input
                    id="dietary"
                    value={dietaryRequirements}
                    onChange={event => setDietaryRequirements(event.target.value)}
                    placeholder="Vegetarian, vegan, halal, allergies, etc."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message (optional)</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    rows={4}
                    placeholder="Leave us a note..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {error && (
                <p className="font-sans text-[13px] text-burgundy text-center">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'saving'}
                className="w-full font-sans text-[10px] tracking-extreme uppercase bg-burgundy text-white py-5 hover:bg-burgundy-dark disabled:opacity-60 transition-colors duration-300"
              >
                {status === 'saving' ? 'Saving...' : 'Save RSVP'}
              </button>
            </form>
          </div>
        </section>
      )}
    </motion.div>
  )
}
