import { useState } from 'react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

// Replace YOUR_FORM_ID with your Formspree form ID
// 1. Go to https://formspree.io and create a free account
// 2. Create a new form and copy the form ID (e.g. "xrgjebyp")
// 3. Paste it here: https://formspree.io/f/YOUR_FORM_ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

const inputClass =
  'w-full bg-white border border-gold/25 text-ink font-sans text-[14px] font-light px-5 py-4 focus:outline-none focus:border-gold transition-colors duration-200 placeholder:text-ink/30'

const labelClass = 'block font-sans text-[10px] tracking-extreme uppercase text-ink/50 mb-2'

export default function RsvpPage() {
  const [status, setStatus] = useState('idle') // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const data = new FormData(e.target)
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        e.target.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="RSVP"
        subtitle="Please respond by August 15, 2026"
      />

      <section className="py-24 px-6 bg-cream">
        <div className="max-w-2xl mx-auto">

          {status === 'success' ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-gold text-5xl block mb-8">◆</span>
              <h2 className="font-serif text-4xl font-light text-ink mb-4">
                Thank you!
              </h2>
              <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed">
                We've received your RSVP and can't wait to celebrate with you.
                We'll be in touch with more details as the date approaches.
              </p>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-7"
            >
              {/* Full name */}
              <div>
                <label htmlFor="name" className={labelClass}>Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>

              {/* Attending */}
              <div>
                <label className={labelClass}>Will you be attending?</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: 'yes', label: 'Joyfully accepts' },
                    { value: 'no', label: 'Regretfully declines' },
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 border border-gold/25 bg-white px-5 py-4 cursor-pointer hover:border-gold transition-colors duration-200 group"
                    >
                      <input
                        type="radio"
                        name="attending"
                        value={opt.value}
                        required
                        className="accent-burgundy w-4 h-4 flex-shrink-0"
                      />
                      <span className="font-sans text-[13px] font-light text-ink/70 group-hover:text-ink transition-colors">
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Number of guests */}
              <div>
                <label htmlFor="guests" className={labelClass}>Number of Guests (including yourself)</label>
                <select
                  id="guests"
                  name="guests"
                  className={inputClass}
                  defaultValue=""
                >
                  <option value="" disabled>Select number of guests</option>
                  {[1, 2, 3, 4].map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* Dietary */}
              <div>
                <label htmlFor="dietary" className={labelClass}>Dietary Requirements</label>
                <input
                  id="dietary"
                  name="dietary"
                  type="text"
                  placeholder="Vegetarian, vegan, halal, allergies, etc."
                  className={inputClass}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className={labelClass}>Message (optional)</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Leave us a note..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {status === 'error' && (
                <p className="font-sans text-[13px] text-burgundy text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full font-sans text-[10px] tracking-extreme uppercase bg-burgundy text-white py-5 hover:bg-burgundy-dark disabled:opacity-60 transition-colors duration-300"
              >
                {status === 'loading' ? 'Sending...' : 'Send RSVP'}
              </button>
            </motion.form>
          )}

          {/* Contact info */}
          <motion.div
            className="mt-16 pt-12 border-t border-gold/20 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-6">
              Questions or concerns?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="tel:+61490800395"
                className="flex items-center gap-3 font-sans font-light text-[14px] text-ink/60 hover:text-ink transition-colors"
              >
                <span className="text-gold/60">✆</span>
                (+61) 490 800 395
              </a>
              <a
                href="mailto:estherabraham2812@gmail.com"
                className="flex items-center gap-3 font-sans font-light text-[14px] text-ink/60 hover:text-ink transition-colors"
              >
                <span className="text-gold/60">✉</span>
                estherabraham2812@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
