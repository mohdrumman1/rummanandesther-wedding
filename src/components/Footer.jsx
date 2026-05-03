import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="bg-ink text-white/60 py-16 px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="h-px w-16 bg-gold/30" />
          <span className="font-script text-5xl text-gold/70">R & E</span>
          <span className="h-px w-16 bg-gold/30" />
        </div>

        <p className="font-serif text-lg italic text-white/40 mb-2">
          Rumman & Esther
        </p>
        <p className="font-sans text-[11px] tracking-ultra uppercase text-gold/50 mb-8">
          November 26, 2026 &nbsp;·&nbsp; Hunter Valley, Australia
        </p>

        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
          {[
            { to: '/', label: 'Home' },
            { to: '/save-the-date', label: 'Save the Date' },
            { to: '/events', label: 'Events' },
            { to: '/dress-code', label: 'Dress Code' },
            { to: '/registry', label: 'Registry' },
            { to: '/accommodation', label: 'Accommodation' },
            { to: '/rsvp', label: 'RSVP' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="font-sans text-[10px] tracking-ultra uppercase text-white/40 hover:text-gold/70 transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="h-px bg-white/10 mb-8" />

        <p className="font-sans text-[10px] tracking-wider text-white/25">
          Made with love &nbsp;·&nbsp; rummanandesther.com
        </p>
      </motion.div>
    </footer>
  )
}
