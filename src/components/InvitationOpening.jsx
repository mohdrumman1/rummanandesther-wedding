import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'

const openingEase = [0.22, 1, 0.36, 1]

export default function InvitationOpening({ onComplete }) {
  const shouldReduceMotion = useReducedMotion()
  const [imageReady, setImageReady] = useState(false)
  const [phase, setPhase] = useState('sealed')
  const skipRef = useRef(null)
  const dialogRef = useRef(null)
  const heroExpandedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const envelopeVisible = phase !== 'hero' && phase !== 'departing'
  const heroExpanded = phase === 'hero' || phase === 'departing'
  const letterRaised = phase === 'letter' || heroExpanded

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (imageReady) return undefined
    const fallback = window.setTimeout(() => onCompleteRef.current(), 2500)
    return () => window.clearTimeout(fallback)
  }, [imageReady])

  useEffect(() => {
    heroExpandedRef.current = heroExpanded
    if (heroExpanded) dialogRef.current?.focus({ preventScroll: true })
  }, [heroExpanded])

  useEffect(() => {
    if (shouldReduceMotion) {
      onCompleteRef.current()
      return undefined
    }
    if (!imageReady) return undefined

    const timers = [
      window.setTimeout(() => setPhase('opening'), 450),
      window.setTimeout(() => setPhase('letter'), 1200),
      window.setTimeout(() => setPhase('hero'), 2050),
      window.setTimeout(() => setPhase('departing'), 3400),
      window.setTimeout(() => onCompleteRef.current(), 4000),
    ]

    return () => timers.forEach(window.clearTimeout)
  }, [imageReady, shouldReduceMotion])

  useEffect(() => {
    if (shouldReduceMotion) return undefined

    const root = document.getElementById('root')
    const activeElement = document.activeElement
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const rootWasInert = root?.hasAttribute('inert')
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`
    root?.setAttribute('inert', '')
    window.requestAnimationFrame(() => skipRef.current?.focus({ preventScroll: true }))

    const handleKeyDown = event => {
      if (event.key === 'Escape') onCompleteRef.current()
      if (event.key === 'Tab') {
        event.preventDefault()
        const focusTarget = heroExpandedRef.current ? dialogRef.current : skipRef.current
        focusTarget?.focus({ preventScroll: true })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      if (!rootWasInert) root?.removeAttribute('inert')
      if (activeElement instanceof HTMLElement) activeElement.focus({ preventScroll: true })
    }
  }, [shouldReduceMotion])

  if (shouldReduceMotion) return null

  return createPortal(
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-burgundy-dark focus:outline-none"
      role="dialog"
      aria-modal="true"
      aria-label="Opening wedding invitation"
      tabIndex={-1}
      data-invitation-opening-phase={phase}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'departing' ? 0 : 1 }}
      transition={{ duration: 0.65, ease: 'easeInOut' }}
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(201,169,110,0.24),rgba(74,30,36,0.98)_64%)]"
        animate={{ opacity: heroExpanded ? 0 : 1 }}
        transition={{ duration: 0.7 }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, #FAF6F0 0, #FAF6F0 1px, transparent 1px, transparent 20px)',
        }}
        animate={{ opacity: heroExpanded ? 0 : 0.07 }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      />

      <motion.button
        ref={skipRef}
        type="button"
        onClick={() => onCompleteRef.current()}
        className="absolute z-[80] border border-white/30 bg-black/10 px-5 py-3 font-sans text-[9px] tracking-extreme uppercase text-white/80 backdrop-blur-sm transition-colors hover:border-gold hover:text-gold focus:outline-none focus:ring-2 focus:ring-gold"
        animate={{ opacity: heroExpanded ? 0 : 1 }}
        transition={{ duration: 0.35 }}
        style={{
          pointerEvents: heroExpanded ? 'none' : 'auto',
          right: 'calc(1.25rem + env(safe-area-inset-right))',
          top: 'calc(1.25rem + env(safe-area-inset-top))',
        }}
        disabled={heroExpanded}
        tabIndex={heroExpanded ? -1 : 0}
        aria-label="Skip invitation opening"
      >
        Skip intro
      </motion.button>

      <motion.div
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center"
        animate={{ y: heroExpanded ? 0 : letterRaised ? '-11vh' : '6vh' }}
        transition={{
          duration: heroExpanded ? 0.72 : 0.75,
          delay: heroExpanded ? 0.4 : 0,
          ease: openingEase,
        }}
        aria-hidden="true"
      >
        <motion.div
          className="relative overflow-hidden bg-burgundy shadow-[0_30px_90px_rgba(20,7,10,0.5)]"
          initial={false}
          animate={{
            width: heroExpanded ? '100vw' : 'min(68vw, 500px)',
            height: heroExpanded ? '100svh' : 'min(44vw, 320px)',
            opacity: phase === 'sealed' ? 0 : 1,
            scale: phase === 'sealed' ? 0.82 : 1,
            borderRadius: heroExpanded ? 0 : 2,
          }}
          transition={{
            width: { duration: 0.72, delay: heroExpanded ? 0.4 : 0, ease: openingEase },
            height: { duration: 0.72, delay: heroExpanded ? 0.4 : 0, ease: openingEase },
            opacity: { duration: 0.35 },
            scale: { duration: 0.75, ease: openingEase },
            borderRadius: { duration: 0.55, delay: heroExpanded ? 0.36 : 0 },
          }}
        >
          <img
            src="/images/hero-opening.jpg"
            alt=""
            className="h-full w-full object-cover object-[80%_center] sm:object-center"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setImageReady(true)}
            onError={() => onCompleteRef.current()}
          />
          <motion.div
            className="absolute inset-3 border border-gold/65"
            animate={{ opacity: heroExpanded ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </motion.div>

      {/* A viewport-aligned matte makes it impossible for the photograph to render below the envelope edge. */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-[35]"
        data-invitation-bottom-matte
        style={{
          clipPath: 'inset(calc(50% + min(27.6316vw, 203.9474px)) 0 0 0)',
          backgroundColor: '#4A1E24',
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(250,246,240,0.07) 0, rgba(250,246,240,0.07) 1px, transparent 1px, transparent 20px), radial-gradient(circle at 50% 42%, rgba(201,169,110,0.24), rgba(74,30,36,0.98) 64%)',
        }}
        animate={{ opacity: envelopeVisible ? 1 : 0 }}
        transition={{
          duration: envelopeVisible ? 0.2 : 0.1,
          delay: envelopeVisible ? 0 : 0.35,
          ease: 'linear',
        }}
        aria-hidden="true"
      />

      <div
        className="relative aspect-[1.52/1] w-[84vw] max-w-[620px]"
        data-invitation-envelope
        aria-hidden="true"
      >
        {/* The body and flap sit behind the photograph. */}
        <motion.div
          className="absolute inset-0 z-20 [perspective:1400px]"
          animate={{ opacity: envelopeVisible ? 1 : 0, y: envelopeVisible ? 0 : '18vh', scale: envelopeVisible ? 1 : 0.94 }}
          transition={{ duration: envelopeVisible ? 0.75 : 0.38, ease: openingEase }}
        >
          {/* Paper body and its subtly raised edge */}
          <div className="absolute inset-0 overflow-hidden rounded-[2px] border border-[#bba984]/60 bg-[#e8dcc4] shadow-[0_38px_90px_rgba(18,5,8,0.48),0_3px_0_rgba(91,67,45,0.22)]">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(83,61,43,0.16) 0.65px, transparent 0.8px), linear-gradient(155deg, rgba(255,255,255,0.5), transparent 46%, rgba(113,83,54,0.07))',
                backgroundSize: '7px 7px, 100% 100%',
              }}
            />
            <div className="absolute inset-[3px] rounded-[1px] border border-white/35" />
          </div>

          {/* The flap has a front and back so the fold remains visible as it opens. */}
          <motion.div
            className="absolute inset-x-[1px] top-[1px] z-20 h-[58%] origin-top [transform-style:preserve-3d]"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              filter: 'drop-shadow(0 3px 2px rgba(76, 54, 35, 0.16))',
            }}
            initial={false}
            animate={{ rotateX: phase === 'sealed' ? 0 : -178 }}
            transition={{ duration: 0.95, ease: [0.45, 0, 0.2, 1] }}
          >
            <div
              className="absolute inset-0 bg-[#f2e9d8] [backface-visibility:hidden]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(83,61,43,0.12) 0.6px, transparent 0.8px), linear-gradient(155deg, rgba(255,255,255,0.62), rgba(217,199,165,0.2) 70%, rgba(124,89,54,0.09))',
                backgroundSize: '7px 7px, 100% 100%',
              }}
            />
            <div
              className="absolute inset-0 bg-[#d8c7a9] [backface-visibility:hidden] [transform:rotateX(180deg)]"
              style={{
                backgroundImage:
                  'linear-gradient(160deg, rgba(114,47,55,0.12), rgba(255,255,255,0.28) 48%, rgba(91,64,42,0.13))',
              }}
            />
          </motion.div>
        </motion.div>

        {/* The pocket and seal remain in front as the photograph slides out. */}
        <motion.div
          className="absolute inset-0 z-40"
          animate={{ opacity: envelopeVisible ? 1 : 0, y: envelopeVisible ? 0 : '18vh', scale: envelopeVisible ? 1 : 0.94 }}
          transition={{ duration: envelopeVisible ? 0.75 : 0.38, ease: openingEase }}
        >
          <div
            className="absolute inset-x-[1px] bottom-[1px] h-[76%] overflow-hidden bg-[#f3ead9]"
            style={{ clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-50"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(83,61,43,0.12) 0.6px, transparent 0.8px)',
                backgroundSize: '7px 7px',
              }}
            />
            <div
              className="absolute inset-y-0 left-0 w-1/2 bg-[linear-gradient(135deg,rgba(193,170,130,0.24),rgba(255,255,255,0.13)_55%,transparent_56%)]"
              style={{ clipPath: 'polygon(0 0, 100% 58%, 0 100%)' }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 bg-[linear-gradient(225deg,rgba(255,255,255,0.28),rgba(184,156,111,0.13)_55%,transparent_56%)]"
              style={{ clipPath: 'polygon(100% 0, 0 58%, 100% 100%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(190,164,121,0.08))]"
              style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
            />
          </div>
          <div className="absolute inset-x-[3%] bottom-0 h-px shadow-[0_18px_28px_7px_rgba(18,5,8,0.42)]" />

          {/* Position and animation use separate transforms so the seal stays truly centred. */}
          <div
            className="absolute left-1/2 top-[55%] z-50 -translate-x-1/2 -translate-y-1/2"
            data-invitation-seal
          >
            <motion.div
              className="relative flex h-16 w-16 items-center justify-center border border-[#ddb96f]/65 text-gold-light shadow-[0_9px_18px_rgba(42,31,26,0.38),inset_0_1px_2px_rgba(255,235,190,0.32)] sm:h-[74px] sm:w-[74px]"
              style={{
                borderRadius: '48% 52% 46% 54% / 53% 47% 55% 45%',
                backgroundImage:
                  'radial-gradient(circle at 32% 24%, rgba(255,214,172,0.22), transparent 22%), radial-gradient(circle at 68% 76%, rgba(62,13,24,0.35), transparent 48%), linear-gradient(145deg, #8d3542, #6b202d)',
              }}
              animate={{
                opacity: phase === 'sealed' ? 1 : 0,
                scale: phase === 'sealed' ? 1 : 0.72,
              }}
              transition={{ duration: 0.35 }}
            >
              <div className="absolute inset-[6px] rounded-full border border-gold/35 shadow-[inset_0_1px_3px_rgba(42,15,19,0.35)]" />
              <div className="absolute left-[18%] top-[14%] h-[14%] w-[24%] rotate-[-18deg] rounded-full bg-white/10 blur-[1px]" />
              <span className="relative whitespace-nowrap font-script text-xl text-gold-light drop-shadow-[0_1px_0_rgba(58,19,25,0.8)] sm:text-2xl">
                R&amp;E
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>,
    document.body,
  )
}
