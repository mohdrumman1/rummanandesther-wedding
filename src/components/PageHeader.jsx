import { motion } from 'framer-motion'

export default function PageHeader({ title, subtitle, dark = false }) {
  return (
    <div className={`pt-28 sm:pt-36 pb-16 px-6 text-center ${dark ? 'bg-ink text-white' : 'bg-cream text-ink border-b border-gold/15'}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <p className={`font-sans text-[10px] tracking-extreme uppercase mb-4 ${dark ? 'text-gold/60' : 'text-gold'}`}>
          Rumman &amp; Esther
        </p>
        <h1 className={`font-serif text-5xl md:text-6xl lg:text-7xl font-light mb-5 ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
        </h1>
        {subtitle && (
          <p className={`font-sans text-sm tracking-wider ${dark ? 'text-white/40' : 'text-ink/40'}`}>
            {subtitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`h-px w-16 ${dark ? 'bg-gold/30' : 'bg-gold/40'}`} />
          <span className={`text-xl ${dark ? 'text-gold/40' : 'text-gold/60'}`}>◆</span>
          <span className={`h-px w-16 ${dark ? 'bg-gold/30' : 'bg-gold/40'}`} />
        </div>
      </motion.div>
    </div>
  )
}
