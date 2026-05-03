import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/save-the-date', label: 'Save the Date' },
  { to: '/events', label: 'Events' },
  { to: '/dress-code', label: 'Dress Code' },
  { to: '/registry', label: 'Registry' },
  { to: '/accommodation', label: 'Accommodation' },
  { to: '/rsvp', label: 'RSVP' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const linkClass = (isActive) =>
    `font-sans text-[10px] tracking-ultra uppercase transition-colors duration-300 ${
      scrolled
        ? isActive ? 'text-burgundy' : 'text-ink hover:text-gold'
        : isActive ? 'text-gold' : 'text-white/90 hover:text-gold-light'
    }`

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-cream/96 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">

          {/* Left links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 3).map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => linkClass(isActive)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Center monogram */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0"
          >
            <span className={`font-script text-4xl transition-colors duration-300 select-none ${
              scrolled ? 'text-burgundy' : 'text-white'
            }`}>
              R&nbsp;&amp;&nbsp;E
            </span>
          </Link>

          {/* Right links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(3).map(link => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => linkClass(isActive)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden ml-auto p-2 transition-colors ${scrolled ? 'text-ink' : 'text-white'}`}
            aria-label="Toggle navigation"
          >
            <span className="sr-only">Menu</span>
            <div className="w-6 flex flex-col gap-[5px]">
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px] w-6' : 'w-6'}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 w-4' : 'w-4'}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px] w-6' : 'w-6'}`} />
            </div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-cream flex flex-col items-center justify-center"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="flex items-center gap-3 mb-12 opacity-30">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold text-lg">◆</span>
              <span className="h-px w-12 bg-gold" />
            </div>
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 + 0.15, duration: 0.4 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `font-serif text-4xl font-light tracking-wide transition-colors ${
                        isActive ? 'text-burgundy' : 'text-ink hover:text-gold'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="flex items-center gap-3 mt-12 opacity-30">
              <span className="h-px w-12 bg-gold" />
              <span className="text-gold text-lg">◆</span>
              <span className="h-px w-12 bg-gold" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
