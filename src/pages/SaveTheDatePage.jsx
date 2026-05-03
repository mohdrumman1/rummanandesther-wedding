import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const WEDDING_DATE = new Date('2026-11-26T12:00:00+11:00')

function getTimeLeft() {
  const now = new Date()
  const diff = WEDDING_DATE - now
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ opacity: 0.4, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="font-serif text-6xl sm:text-8xl md:text-9xl font-light text-white tabular-nums leading-none"
      >
        {String(value).padStart(2, '0')}
      </motion.div>
      <span className="font-sans text-[10px] tracking-extreme uppercase text-gold/60 mt-3">
        {label}
      </span>
    </div>
  )
}

export default function SaveTheDatePage() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Save the Date"
        subtitle="November 26, 2026 · Hunter Valley, Australia"
      />

      {/* Countdown */}
      <section className="bg-burgundy py-24 px-6 text-center relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="font-sans text-[10px] tracking-extreme uppercase text-gold/60 mb-16">
            Counting down to the big day
          </p>

          <div className="flex items-start justify-center gap-6 sm:gap-10 md:gap-16 mb-16">
            <CountdownUnit value={timeLeft.days} label="Days" />
            <div className="font-serif text-5xl sm:text-7xl text-white/20 mt-4">·</div>
            <CountdownUnit value={timeLeft.hours} label="Hours" />
            <div className="font-serif text-5xl sm:text-7xl text-white/20 mt-4">·</div>
            <CountdownUnit value={timeLeft.minutes} label="Minutes" />
            <div className="font-serif text-5xl sm:text-7xl text-white/20 mt-4">·</div>
            <CountdownUnit value={timeLeft.seconds} label="Seconds" />
          </div>

          <div className="flex items-center justify-center gap-5 mb-6">
            <span className="h-px w-16 bg-gold/30" />
            <span className="text-gold/40">◆</span>
            <span className="h-px w-16 bg-gold/30" />
          </div>
        </motion.div>
      </section>

      {/* Date details */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-6xl md:text-8xl font-light text-ink tracking-wider mb-6">
              26<span className="text-gold/60 mx-3">.</span>11<span className="text-gold/60 mx-3">.</span>2026
            </h2>
            <p className="font-sans text-[11px] tracking-ultra uppercase text-ink/40 mb-12">
              Thursday &nbsp;·&nbsp; Hunter Valley, New South Wales, Australia
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-16 text-left">
              <div className="border border-gold/25 bg-white p-8">
                <span className="font-sans text-[10px] tracking-extreme uppercase text-gold block mb-4">
                  The Ceremony
                </span>
                <p className="font-serif text-xl font-light text-ink mb-2">
                  Venue details coming soon
                </p>
                <p className="font-sans text-[13px] text-ink/50 font-light">
                  Hunter Valley, NSW
                </p>
                <div className="h-px bg-gold/20 my-4" />
                <p className="font-sans text-[13px] text-ink/40 font-light">
                  Ceremony on 26 November 2026
                </p>
              </div>
              <div className="border border-gold/25 bg-white p-8">
                <span className="font-sans text-[10px] tracking-extreme uppercase text-gold block mb-4">
                  The Reception
                </span>
                <p className="font-serif text-xl font-light text-ink mb-2">
                  Rydges Resort Hunter Valley
                </p>
                <p className="font-sans text-[13px] text-ink/50 font-light">
                  430 Wine Country Drive, Lovedale NSW 2325
                </p>
                <div className="h-px bg-gold/20 my-4" />
                <p className="font-sans text-[13px] text-ink/40 font-light">
                  Saturday, 12 December 2026
                </p>
              </div>
            </div>

            <p className="font-sans font-light text-[14px] text-ink/55 leading-relaxed mb-10 max-w-lg mx-auto">
              We'll be sharing more details as the date approaches. In the meantime,
              please save the date and let us know if you'll be joining us.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/rsvp"
                className="font-sans text-[10px] tracking-extreme uppercase bg-burgundy text-white px-10 py-4 hover:bg-burgundy-dark transition-colors duration-300"
              >
                RSVP Now
              </Link>
              <Link
                to="/events"
                className="font-sans text-[10px] tracking-extreme uppercase border border-ink text-ink px-10 py-4 hover:bg-ink hover:text-cream transition-all duration-300"
              >
                View Events
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
