import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
}

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Parallax background */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div
            className="w-full h-full bg-cover bg-no-repeat bg-[80%_center] sm:bg-center"
            style={{
              backgroundImage: `url('/images/hero.jpg'), linear-gradient(160deg, #4A1E24 0%, #722F37 40%, #9E7B3C 75%, #FAF6F0 100%)`,
            }}
          />
        </motion.div>

        {/* Layered overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        {/* Hero content */}
        <motion.div
          className="relative h-full flex flex-col items-center justify-center text-center px-4"
          style={{ opacity: heroOpacity }}
        >
          {/* Decorative top line */}
          <motion.div
            className="flex items-center gap-5 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <span className="h-px w-20 bg-white/50" />
            <span
              className="font-sans text-[10px] tracking-extreme uppercase text-white/90"
              style={{ textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}
            >
              You're invited to the wedding of
            </span>
            <span className="h-px w-20 bg-white/50" />
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[96px] font-light text-white tracking-wider leading-tight mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            Rumman&nbsp;&amp;&nbsp;Esther
          </motion.h1>

          {/* Date line */}
          <motion.div
            className="flex items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
          >
            <span className="h-px w-12 bg-gold/50" />
            <p className="font-sans text-sm tracking-ultra uppercase text-white/75">
              12 December, 2026
            </p>
            <span className="h-px w-12 bg-gold/50" />
          </motion.div>

          {/* RSVP hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="mt-12"
          >
            <Link
              to="/rsvp"
              className="font-sans text-[10px] tracking-extreme uppercase border border-white/40 text-white/80 px-8 py-3 hover:border-gold hover:text-gold transition-all duration-400"
            >
              RSVP
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-10 flex flex-col items-center gap-2 text-white/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <span className="font-sans text-[9px] tracking-extreme uppercase">Scroll</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
              animate={{ scaleY: [1, 0.3, 1], originY: 'top' }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── WELCOME ─── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Photo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div
              className="aspect-[3/4] bg-cover bg-stone-300"
              style={{
                backgroundImage: `url('/images/welcome.jpg'), linear-gradient(180deg, #d6cfc5 0%, #afa89e 100%)`,
                backgroundPosition: '20% center',
                filter: 'grayscale(100%)',
              }}
            />
            {/* Offset gold border */}
            <div className="absolute -bottom-5 -right-5 w-full h-full border border-gold/60 -z-10 pointer-events-none" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-7">
              <span className="h-px w-8 bg-gold" />
              <span className="font-sans text-[10px] tracking-extreme uppercase text-gold">
                Welcome
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-3 leading-snug">
              We're getting
            </h2>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink mb-10 leading-snug italic">
              married.
            </h2>

            <p className="font-sans font-light text-[15px] leading-relaxed text-ink/75 mb-5">
              After years together, we're making it official. And we want the
              people we love most there to witness it. The wedding takes place on
              12 December 2026 in the stunning Hunter Valley, NSW.
            </p>
            <p className="font-sans font-light text-[15px] leading-relaxed text-ink/75 mb-10">
              We're planning a weekend to remember: a Sangeet the night before,
              vows in the vineyard, and a reception that goes all night. Come
              ready to celebrate.
            </p>

            <Link
              to="/rsvp"
              className="inline-block font-sans text-[10px] tracking-extreme uppercase border border-ink text-ink px-9 py-4 hover:bg-ink hover:text-cream transition-all duration-300"
            >
              RSVP Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── DATE BANNER ─── */}
      <section className="py-24 bg-burgundy text-white text-center px-6 relative overflow-hidden">
        {/* Decorative background texture */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
        />
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-5 mb-6">
            <span className="h-px w-16 bg-gold/40" />
            <span className="font-sans text-[10px] tracking-extreme uppercase text-gold/70">
              Mark Your Calendar
            </span>
            <span className="h-px w-16 bg-gold/40" />
          </div>

          <h2 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-widest mb-5 text-white">
            12.12.2026
          </h2>

          <p className="font-sans text-[11px] tracking-ultra uppercase text-white/50 mb-10">
            Hunter Valley, New South Wales, Australia
          </p>

          <Link
            to="/save-the-date"
            className="font-sans text-[10px] tracking-extreme uppercase border border-gold/50 text-gold px-9 py-3 hover:bg-gold/10 transition-colors duration-300"
          >
            Save the Date
          </Link>
        </motion.div>
      </section>

      {/* ─── EVENTS PREVIEW ─── */}
      <section className="py-28 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-4">
              The Celebration
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-ink">
              Three beautiful events
            </h2>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'The Sangeet', icon: '◆', desc: 'Kick off the celebrations the night before: music, dancing, and good company at our home in Cameron Park.', date: 'December 11, 2026' },
            { title: 'The Ceremony', icon: '◆', desc: 'We say our vows surrounded by the rolling vineyards of Hunter Valley. Venue details coming very soon.', date: 'December 12, 2026' },
            { title: 'The Reception', icon: '◆', desc: 'A western-inspired night at Rydges Resort Hunter Valley. Great food, great music, and dancing till late.', date: 'December 12, 2026' },
          ].map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="border border-gold/30 bg-white p-10 text-center"
            >
              <span className="text-gold/50 text-2xl block mb-5">{event.icon}</span>
              <h3 className="font-serif text-2xl font-light text-ink mb-4">{event.title}</h3>
              <div className="h-px bg-gold/20 mb-5" />
              <p className="font-sans font-light text-[14px] text-ink/70 leading-relaxed mb-6">
                {event.desc}
              </p>
              <p className="font-sans text-[10px] tracking-ultra uppercase text-gold">
                {event.date}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/events"
            className="font-sans text-[10px] tracking-extreme uppercase border border-gold text-gold px-9 py-3 hover:bg-gold hover:text-white transition-all duration-300"
          >
            View Events
          </Link>
        </div>
      </section>

    </motion.div>
  )
}
