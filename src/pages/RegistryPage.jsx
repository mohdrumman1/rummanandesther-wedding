import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

export default function RegistryPage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Registry" subtitle="Your presence is the greatest gift" />

      <section className="py-32 px-6 bg-cream">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <span className="text-gold/40 text-4xl block mb-8">◆</span>

            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-6">
              Coming soon
            </h2>

            <div className="flex items-center justify-center gap-4 my-8">
              <span className="h-px w-16 bg-gold/30" />
              <span className="text-gold/40 text-sm">◆</span>
              <span className="h-px w-16 bg-gold/30" />
            </div>

            <p className="font-sans font-light text-[15px] text-ink/60 leading-relaxed mb-6">
              Your presence at our wedding is truly the greatest gift of all.
              If you'd like to give a gift, our registry details will be listed
              here soon.
            </p>

            <p className="font-sans font-light text-[14px] text-ink/40 leading-relaxed max-w-md mx-auto">
              We are so grateful for your love and support. Thank you for being
              part of our celebration.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
