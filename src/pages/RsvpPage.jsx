import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
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

const inviteEase = [0.22, 1, 0.36, 1]

const pluralizeGuests = count => `${count} guest${count === 1 ? '' : 's'}`

const inviteItem = {
  hidden: { opacity: 0, y: 26 },
  visible: index => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.24 + index * 0.14, duration: 0.9, ease: inviteEase },
  }),
}

function InviteMotif({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      <div className="relative h-full w-full">
        <div className="absolute inset-0 rounded-full border border-gold/20" />
        <div className="absolute inset-[10%] rounded-full border border-gold/15" />
        <div className="absolute left-1/2 top-1/2 h-[72%] w-px -translate-x-1/2 -translate-y-1/2 bg-gold/15" />
        <div className="absolute left-1/2 top-1/2 h-px w-[72%] -translate-x-1/2 -translate-y-1/2 bg-gold/15" />
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rotate-45 border border-gold/15" />
        <div className="absolute left-1/2 top-1/2 h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10" />
      </div>
    </div>
  )
}

function InvitationHero({ group, status, onOpenRsvp }) {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const cardY = useTransform(scrollY, [0, 900], ['0%', shouldReduceMotion ? '0%' : '10%'])
  const ornamentsY = useTransform(scrollY, [0, 900], ['0%', shouldReduceMotion ? '0%' : '-8%'])
  const cardScale = useTransform(scrollY, [0, 900], [1, shouldReduceMotion ? 1 : 0.985])

  return (
    <section
      className="relative min-h-[100svh] overflow-hidden bg-burgundy-dark text-white"
      aria-label="Wedding invitation"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(201,169,110,0.24)_0,rgba(114,47,55,0.52)_34%,rgba(74,30,36,0.96)_76%)]" />
      <div
        className="absolute inset-0 opacity-[0.09]"
        style={{
          backgroundImage: 'repeating-linear-gradient(135deg, #FAF6F0 0, #FAF6F0 1px, transparent 1px, transparent 18px)',
        }}
      />

      <motion.div style={{ y: ornamentsY }} className="absolute inset-0">
        <InviteMotif className="-left-24 top-24 h-80 w-80 md:h-[30rem] md:w-[30rem]" />
        <InviteMotif className="-right-24 bottom-16 h-72 w-72 rotate-12 md:h-[28rem] md:w-[28rem]" />
        <div className="absolute left-8 top-32 hidden h-[62vh] w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:block" />
        <div className="absolute right-8 top-32 hidden h-[62vh] w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent md:block" />
      </motion.div>

      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-5 py-28 sm:px-8 lg:px-12">
        <motion.div
          className="relative w-full max-w-3xl text-center"
          style={{ y: cardY, scale: cardScale }}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate="visible"
        >
          <motion.div
            className="absolute -inset-4 border border-gold/35 sm:-inset-6"
            initial={shouldReduceMotion ? false : { clipPath: 'inset(50% 50% 50% 50%)', opacity: 0 }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
            transition={{ duration: 1.25, ease: inviteEase }}
            aria-hidden="true"
          />
          <div className="relative overflow-hidden border border-gold/55 bg-cream px-6 py-12 text-ink shadow-2xl shadow-ink/40 sm:px-10 md:px-16 md:py-14">
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #722F37 1px, transparent 0)',
                backgroundSize: '18px 18px',
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-3 border border-gold/35 pointer-events-none" aria-hidden="true" />
            <div className="absolute left-1/2 top-5 h-12 w-px -translate-x-1/2 bg-gradient-to-b from-gold/60 to-transparent" aria-hidden="true" />
            <div className="absolute bottom-5 left-1/2 h-12 w-px -translate-x-1/2 bg-gradient-to-t from-gold/60 to-transparent" aria-hidden="true" />
            <div className="relative">
            <motion.div custom={0} variants={inviteItem}>
              <div className="mx-auto mb-8 flex items-center justify-center gap-4">
                <span className="h-px w-10 bg-gold/70 sm:w-16" />
                <span className="font-sans text-[10px] tracking-extreme uppercase text-gold-dark">
                  You are invited
                </span>
                <span className="h-px w-10 bg-gold/70 sm:w-16" />
              </div>
            </motion.div>

            <motion.p
              custom={1}
              variants={inviteItem}
              className="font-sans text-[10px] tracking-extreme uppercase text-ink/55"
            >
              To the wedding of
            </motion.p>
            <motion.h1
              custom={2}
              variants={inviteItem}
              className="mt-5 font-serif text-5xl font-light leading-none text-burgundy sm:text-7xl md:text-8xl"
            >
              Rumman
              <span className="block py-1 font-script text-5xl text-gold-dark sm:text-6xl md:text-7xl">&amp;</span>
              Esther
            </motion.h1>

            <motion.div custom={3} variants={inviteItem} className="mt-9">
              <p className="font-sans text-[11px] tracking-ultra uppercase text-ink/70">
                Saturday, 12 December 2026
              </p>
              <p className="mt-3 font-serif text-2xl font-light text-ink">
                Hunter Valley, New South Wales
              </p>
            </motion.div>

            <motion.div custom={4} variants={inviteItem} className="mx-auto mt-10 max-w-xl">
              <p className="font-sans text-[15px] font-light leading-relaxed text-ink/75">
                {group
                  ? `Dear ${group.householdName}, we would be honoured to celebrate this weekend with you.`
                  : status === 'loading'
                    ? 'Your personal invitation is opening now.'
                    : 'We would be honoured to celebrate this weekend with you.'}
              </p>
            </motion.div>

            <motion.div custom={5} variants={inviteItem} className="mt-11">
              <button
                type="button"
                onClick={onOpenRsvp}
                className="group inline-flex min-h-12 items-center justify-center gap-4 border border-burgundy/35 bg-burgundy px-8 py-4 font-sans text-[10px] tracking-extreme uppercase text-white transition-all duration-300 hover:border-gold hover:bg-burgundy-dark focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-4 focus:ring-offset-cream"
              >
                <span>Open RSVP</span>
                <span className="text-gold transition-transform duration-300 group-hover:translate-y-1">↓</span>
              </button>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/55"
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="font-sans text-[9px] tracking-extreme uppercase">Scroll</span>
        <motion.span
          className="h-10 w-px origin-top bg-gradient-to-b from-gold/70 to-transparent"
          animate={shouldReduceMotion ? undefined : { scaleY: [1, 0.35, 1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

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
  const sangeetInvited = guest.sangeetInvited !== false
  const ceremonyInvited = guest.ceremonyInvited !== false
  const receptionInvited = guest.receptionInvited !== false
  const invitedCount = [sangeetInvited, ceremonyInvited, receptionInvited].filter(Boolean).length
  if (invitedCount === 0) return null
  const gridColsClass = invitedCount === 3 ? 'md:grid-cols-3' : invitedCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'
  const summary = [
    sangeetInvited && `Sangeet: ${responseText(guest.sangeetAttending)}`,
    ceremonyInvited && `Ceremony: ${responseText(guest.ceremonyAttending)}`,
    receptionInvited && `Reception: ${responseText(guest.receptionAttending)}`,
  ].filter(Boolean).join(' · ')
  const childCounterCount = [ceremonyInvited, receptionInvited].filter(Boolean).length
  return (
    <div className="border border-gold/25 bg-white p-6 md:p-7 space-y-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="font-serif text-2xl font-light text-ink">{guest.name}</h3>
          <p className="font-sans text-[12px] text-ink/45 font-light">{summary}</p>
        </div>
        {guest.isAdditional && (
          <span className="self-start font-sans text-[10px] tracking-ultra uppercase text-gold border border-gold/30 px-3 py-2">
            Additional guest
          </span>
        )}
      </div>

      <div className={`grid gap-5 ${gridColsClass}`}>
        {sangeetInvited && (
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
        )}
        {ceremonyInvited && (
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
        )}
        {receptionInvited && (
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
        )}
      </div>

      {guest.childrenAllowed && childCounterCount > 0 && (
        <div className={`pt-5 border-t border-gold/15 grid gap-5 ${childCounterCount === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'}`}>
          {ceremonyInvited && (
            <ChildCounter label="Children attending Ceremony" count={guest.ceremonyChildrenCount || 0}
              max={guest.maxChildren} enabled={guest.ceremonyAttending === true} guestName={guest.name}
              onChange={count => onChange({ ...guest, ceremonyChildrenCount: count })} />
          )}
          {receptionInvited && (
            <ChildCounter label="Children attending Reception" count={guest.receptionChildrenCount || 0}
              max={guest.maxChildren} enabled={guest.receptionAttending === true} guestName={guest.name}
              onChange={count => onChange({ ...guest, receptionChildrenCount: count })} />
          )}
        </div>
      )}
    </div>
  )
}

function AdditionalGuestForm({ remaining, pending, setPending, sangeetInvited, ceremonyInvited, receptionInvited }) {
  const [name, setName] = useState('')
  const fields = [
    sangeetInvited && ['Sangeet', 'sangeetAttending'],
    ceremonyInvited && ['Ceremony', 'ceremonyAttending'],
    receptionInvited && ['Reception', 'receptionAttending'],
  ].filter(Boolean)
  const gridColsClass = fields.length === 3 ? 'md:grid-cols-3' : fields.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1'

  function addGuest() {
    const trimmed = name.trim().replace(/\s+/g, ' ')
    if (!trimmed || pending.length >= remaining) return
    setPending([...pending, {
      name: trimmed,
      sangeetAttending: null,
      ceremonyAttending: null,
      receptionAttending: null,
      sangeetInvited,
      ceremonyInvited,
      receptionInvited,
    }])
    setName('')
  }

  if (remaining <= 0 && pending.length === 0) return null
  if (fields.length === 0) return null

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
              <div className={`grid gap-4 ${gridColsClass}`}>
                {fields.map(([label, field]) => (
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

function SeatSummary({ guests, plusOneLimit, pendingAdditional }) {
  const namedGuestCount = guests.filter(guest => !guest.isAdditional).length
  const submittedAdditionalGuests = guests.filter(guest => guest.isAdditional).length
  const additionalSpots = Number(plusOneLimit || 0)
  const pendingAdditionalGuests = pendingAdditional.length
  const totalGuestCapacity = namedGuestCount + additionalSpots
  const remainingAdditionalSpots = Math.max(0, additionalSpots - submittedAdditionalGuests - pendingAdditionalGuests)

  return (
    <div className="border border-gold/25 bg-white p-7 md:p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-gold flex-shrink-0" />
        <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
          Seat Count
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-gold/20 bg-cream px-5 py-4">
          <p className="font-sans text-[10px] tracking-ultra uppercase text-ink/40">Total seats</p>
          <p className="mt-2 font-serif text-4xl font-light text-burgundy">{totalGuestCapacity}</p>
        </div>
        <div className="border border-gold/20 bg-cream px-5 py-4">
          <p className="font-sans text-[10px] tracking-ultra uppercase text-ink/40">Named guests</p>
          <p className="mt-2 font-serif text-4xl font-light text-ink">{namedGuestCount}</p>
        </div>
        <div className="border border-gold/20 bg-cream px-5 py-4">
          <p className="font-sans text-[10px] tracking-ultra uppercase text-ink/40">Additional spots</p>
          <p className="mt-2 font-serif text-4xl font-light text-ink">{additionalSpots}</p>
        </div>
      </div>
      <p className="mt-5 font-sans text-[13px] font-light leading-relaxed text-ink/55">
        This invitation covers {pluralizeGuests(totalGuestCapacity)}:
        {' '}{pluralizeGuests(namedGuestCount)} named
        {additionalSpots > 0 ? ` + ${additionalSpots} additional spot${additionalSpots === 1 ? '' : 's'}.` : '.'}
        {additionalSpots > 0 && ` ${remainingAdditionalSpots} additional spot${remainingAdditionalSpots === 1 ? '' : 's'} still open on this RSVP.`}
      </p>
    </div>
  )
}

export default function RsvpPage() {
  const { accessCode } = useParams()
  const rsvpRef = useRef(null)
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
  const householdSangeetInvited = useMemo(
    () => guests.length === 0 || guests.some(guest => guest.sangeetInvited !== false),
    [guests],
  )
  const householdCeremonyInvited = useMemo(
    () => guests.length === 0 || guests.some(guest => guest.ceremonyInvited !== false),
    [guests],
  )
  const householdReceptionInvited = useMemo(
    () => guests.length === 0 || guests.some(guest => guest.receptionInvited !== false),
    [guests],
  )
  const householdHasAnyInvites = useMemo(
    () => guests.some(guest =>
      guest.sangeetInvited !== false || guest.ceremonyInvited !== false || guest.receptionInvited !== false
    ),
    [guests],
  )

  function openRsvp() {
    rsvpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!accessCode) return <RsvpFallback />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    const incomplete = guests.filter(guest =>
      (guest.sangeetInvited !== false && !isAnswered(guest.sangeetAttending)) ||
      (guest.ceremonyInvited !== false && !isAnswered(guest.ceremonyAttending)) ||
      (guest.receptionInvited !== false && !isAnswered(guest.receptionAttending))
    )
    if (incomplete.length) {
      setError('Please respond yes or no for each guest and each event before submitting.')
      return
    }
    if (pendingAdditional.some(guest =>
      (householdSangeetInvited && !isAnswered(guest.sangeetAttending)) ||
      (householdCeremonyInvited && !isAnswered(guest.ceremonyAttending)) ||
      (householdReceptionInvited && !isAnswered(guest.receptionAttending))
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
      <InvitationHero group={group} status={status} onOpenRsvp={openRsvp} />

      <div ref={rsvpRef} className="scroll-mt-24">
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
                <motion.div
                  className="border border-gold/25 bg-white p-8"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
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
                </motion.div>

              <motion.div
                className="bg-burgundy text-white p-7 md:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="h-px w-6 bg-gold/60 flex-shrink-0" />
                    <span className="font-sans text-[10px] tracking-extreme uppercase text-gold/80">
                      Dress Code
                    </span>
                  </div>
                  <p className="font-sans font-light text-[14px] text-white/80 leading-relaxed">
                    Indian attire for the Sangeet, western formal for the Ceremony &amp; Reception. See colours to wear and avoid.
                  </p>
                </div>
                <Link
                  to="/dress-code"
                  className="inline-flex items-center justify-center gap-3 font-sans text-[10px] tracking-extreme uppercase border border-gold/60 text-gold px-6 py-4 hover:bg-gold/10 transition-colors duration-300 flex-shrink-0"
                >
                  <span>View Dress Code</span>
                  <span className="text-gold/60">↗</span>
                </Link>
              </motion.div>

              {!householdHasAnyInvites && guests.length > 0 && (
                <div className="border border-gold/25 bg-white p-8 text-center">
                  <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed">
                    We could not find any events for this household on our list. Please contact us and we will help.
                  </p>
                </div>
              )}

              <SeatSummary
                guests={guests}
                plusOneLimit={group.plusOneLimit}
                pendingAdditional={pendingAdditional}
              />

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
                sangeetInvited={householdSangeetInvited}
                ceremonyInvited={householdCeremonyInvited}
                receptionInvited={householdReceptionInvited}
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
      </div>
    </motion.div>
  )
}
