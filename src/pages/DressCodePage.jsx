import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const attire = [
  {
    label: 'Gentlemen',
    suggestion: 'Formal / Black Tie',
    detail: 'Suit or tuxedo, dress shoes. Please avoid white or off-white attire.',
  },
  {
    label: 'Ladies',
    suggestion: 'Formal / Black Tie',
    detail: 'Formal gown or floor-length dress. Please avoid white, off-white, or ivory attire.',
  },
]

export default function DressCodePage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Dress Code" subtitle="We'd love for you to dress to impress" />

      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-4">
              Attire
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-8">
              Formal / Black Tie
            </h2>
            <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed max-w-xl mx-auto">
              We want our wedding day to feel as special as possible. We kindly
              ask our guests to dress in formal or black-tie attire to match the
              elegance of the occasion.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            {attire.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="border border-gold/25 bg-white p-10"
              >
                <span className="text-gold/40 text-2xl block mb-5">◆</span>
                <h3 className="font-serif text-2xl font-light text-ink mb-2">
                  {item.label}
                </h3>
                <p className="font-sans text-[10px] tracking-ultra uppercase text-burgundy mb-5">
                  {item.suggestion}
                </p>
                <div className="h-px bg-gold/15 mb-5" />
                <p className="font-sans font-light text-[14px] text-ink/55 leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Colour palette guidance */}
          <motion.div
            className="bg-ink text-white p-10 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold/50 text-2xl block mb-5">◆</span>
            <h3 className="font-serif text-2xl font-light text-white mb-4">
              A note on colours
            </h3>
            <p className="font-sans font-light text-[14px] text-white/55 leading-relaxed max-w-md mx-auto">
              Please avoid wearing white, off-white, cream, or ivory — we'd love
              for those shades to stay reserved for the bride. All other colours
              are warmly welcomed.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className="h-px w-12 bg-gold/30" />
              <span className="text-gold/40">◆</span>
              <span className="h-px w-12 bg-gold/30" />
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
