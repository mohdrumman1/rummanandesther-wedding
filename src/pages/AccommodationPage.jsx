import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const hotels = [
  {
    name: 'Rydges Resort Hunter Valley',
    stars: '★★★★★',
    desc: 'Resort accommodation on Wine Country Drive, within easy reach of the reception venue.',
    note: 'Our top recommendation for wedding guests.',
  },
  {
    name: 'Spicers Guesthouse',
    stars: '★★★★',
    desc: 'Intimate boutique guest rooms in the heart of Lovedale.',
    note: 'A peaceful option close to vineyard dining.',
  },
  {
    name: 'Hunter Valley Cottage Stay',
    stars: '◆',
    desc: 'Country cottages and farm stays across Hunter Valley for a relaxed weekend.',
    note: 'Book early to secure a stay during the wedding weekend.',
  },
]

export default function AccommodationPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Accommodation"
        subtitle="We want you to feel right at home in Hunter Valley"
      />

      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed max-w-xl mx-auto">
              Hunter Valley is the perfect destination for our wedding weekend.
              Below are some local accommodation suggestions — please book early as
              November is a popular time to visit.
            </p>
          </motion.div>

          <div className="space-y-8 mb-16">
            {hotels.map((hotel, i) => (
              <motion.div
                key={hotel.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="border border-gold/25 bg-white p-8 grid sm:grid-cols-[auto_1fr] gap-6 items-start"
              >
                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center text-gold/60 text-xl flex-shrink-0">
                  ◆
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 className="font-serif text-xl font-light text-ink">{hotel.name}</h3>
                    <span className="font-sans text-[11px] text-gold/60">{hotel.stars}</span>
                  </div>
                  <p className="font-sans font-light text-[14px] text-ink/55 leading-relaxed mb-3">
                    {hotel.desc}
                  </p>
                  <p className="font-sans text-[12px] text-gold font-light italic">
                    {hotel.note}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="bg-burgundy text-white p-10 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold/50 text-2xl block mb-5">◆</span>
            <h3 className="font-serif text-2xl font-light text-white mb-4">
              Need help?
            </h3>
            <p className="font-sans font-light text-[14px] text-white/55 leading-relaxed max-w-md mx-auto mb-6">
              If you have any questions about getting to Hunter Valley or finding somewhere
              to stay, please don't hesitate to reach out to us.
            </p>
            <a
              href="mailto:estherabraham2812@gmail.com"
              className="font-sans text-[10px] tracking-extreme uppercase border border-gold/40 text-gold px-8 py-3 hover:bg-gold/10 transition-colors duration-300"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
