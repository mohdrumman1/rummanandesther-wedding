import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const events = [
  {
    type: 'Ceremony',
    icon: '◇',
    venue: 'Venue details coming soon',
    address: 'Hunter Valley, NSW, Australia',
    time: 'Ceremony begins at 26 November 2026',
    date: 'Thursday, November 26, 2026',
    description:
      'Join us as we exchange our vows in Hunter Valley. Venue and time details will be shared soon.',
  },
  {
    type: 'Reception',
    icon: '◇',
    venue: 'Rydges Resort Hunter Valley',
    address: '430 Wine Country Drive, Lovedale NSW 2325',
    time: 'Western-inspired evening reception',
    date: 'Thursday, November 26, 2026',
    description:
      'Celebrate with us at a western-inspired reception at Rydges Hunter Valley, with food, music, and dancing under the stars.',
  },
]

export default function EventsPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Events"
        subtitle="Thursday, November 26, 2026 · Hunter Valley, Australia"
      />

      {/* Event cards */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto space-y-12">
          {events.map((event, i) => (
            <motion.div
              key={event.type}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="bg-white border border-gold/25 overflow-hidden"
            >
              <div className="grid md:grid-cols-[1fr_2fr]">
                {/* Left accent panel */}
                <div className="bg-burgundy text-white p-10 flex flex-col justify-center">
                  <span className="text-gold/50 text-3xl block mb-5">{event.icon}</span>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-gold/70 mb-2">
                    November 26, 2026
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-1">
                    The {event.type}
                  </h2>
                  <div className="h-px bg-white/15 my-5" />
                  <p className="font-sans text-[12px] text-white/50 font-light">
                    {event.time}
                  </p>
                </div>

                {/* Right detail panel */}
                <div className="p-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="h-px w-6 bg-gold" />
                    <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
                      {event.type} Details
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-ink mb-1">
                    {event.venue}
                  </h3>
                  <p className="font-sans text-[13px] text-ink/50 font-light mb-6">
                    {event.address}
                  </p>

                  <div className="h-px bg-gold/15 mb-6" />

                  <p className="font-sans font-light text-[14px] leading-relaxed text-ink/60 mb-8">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <span className="font-sans text-[10px] tracking-ultra uppercase border border-gold/30 text-gold/70 px-5 py-2 cursor-default">
                      Directions coming soon
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Note */}
      <section className="py-16 px-6 bg-cream border-t border-gold/15">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-12 bg-gold/30" />
              <span className="text-gold/40">◆</span>
              <span className="h-px w-12 bg-gold/30" />
            </div>
            <p className="font-serif italic text-xl text-ink/40 font-light">
              "Venue and timing details will be updated as we finalise plans.
              Check back soon."
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
