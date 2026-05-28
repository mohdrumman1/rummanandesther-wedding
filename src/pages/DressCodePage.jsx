import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const womenPalette = [
  { color: '#7BA7BC', label: 'Steel Blue' },
  { color: '#A8C5D6', label: 'Sky Blue' },
  { color: '#C3B1E1', label: 'Lavender' },
  { color: '#9B72AA', label: 'Mauve' },
  { color: '#F4A7B9', label: 'Blush Pink' },
  { color: '#E8829A', label: 'Rose Pink' },
]

const menPalette = [
  { color: '#D4C5A9', label: 'Linen' },
  { color: '#C8C0B0', label: 'Stone' },
  { color: '#B8C4BB', label: 'Sage' },
  { color: '#A9B4C2', label: 'Slate Blue' },
  { color: '#D6CFC4', label: 'Sand' },
  { color: '#BFB8AF', label: 'Warm Grey' },
]

const sangeetPalette = [
  { color: '#1B2A4A', label: 'Midnight' },
  { color: '#2E4A7A', label: 'Deep Blue' },
  { color: '#4A6FA5', label: 'Royal Blue' },
  { color: '#C0C0C0', label: 'Silver' },
  { color: '#1C1C1C', label: 'Black' },
  { color: '#8A9BB5', label: 'Steel' },
]

export default function DressCodePage() {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Dress Code" subtitle="Two events, two looks. Let's make it memorable." />

      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ─── SANGEET ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Event label */}
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-8 bg-gold flex-shrink-0" />
              <span className="font-serif text-2xl md:text-3xl font-light text-ink">
                The Sangeet
                <span className="font-sans text-[13px] tracking-wide text-gold block sm:inline sm:ml-3 mt-1 sm:mt-0">· Friday, December 11</span>
              </span>
            </div>

            <div className="bg-white border border-gold/25 overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Collage image */}
                <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                  <img
                    src="/images/sangeet-collage.jpeg"
                    alt="Sangeet dress inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Guidance */}
                <div className="p-6 md:p-10 bg-[#0D1B2A] text-white flex flex-col justify-center">
                  <span className="text-gold/50 text-3xl block mb-5">◇</span>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-gold/70 mb-2">Dress code</p>
                  <h2 className="font-serif text-3xl font-light text-white mb-1">Indian Attire</h2>
                  <p className="font-sans text-[12px] text-white/40 font-light mb-6">Preferred</p>
                  <div className="h-px bg-white/10 mb-6" />

                  <p className="font-sans font-light text-[14px] text-white/75 leading-relaxed mb-8">
                    Think <strong className="font-normal text-white">night sky</strong>: deep blues, silver, and black. Indian attire is preferred for both men and women. The more bling the better!
                  </p>

                  {/* Palette */}
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-white/30 mb-4">Colour palette</p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {sangeetPalette.map(swatch => (
                      <div key={swatch.label} className="flex flex-col items-center gap-2">
                        <div
                          className="w-9 h-9 rounded-full border border-white/20"
                          style={{ backgroundColor: swatch.color }}
                        />
                        <span className="font-sans text-[9px] tracking-wide text-white/30">{swatch.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Avoid */}
                  <div className="border border-white/10 px-5 py-4">
                    <p className="font-sans text-[10px] tracking-extreme uppercase text-white/30 mb-2">Please avoid</p>
                    <p className="font-sans font-light text-[13px] text-white/50">
                      Pastel or muted tones · Casual or western attire
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── WEDDING & RECEPTION ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="h-px w-8 bg-gold flex-shrink-0" />
              <span className="font-serif text-2xl md:text-3xl font-light text-ink">
                The Wedding &amp; Reception
                <span className="font-sans text-[13px] tracking-wide text-gold block sm:inline sm:ml-3 mt-1 sm:mt-0">· Saturday, December 12</span>
              </span>
            </div>

            {/* Women */}
            <div className="overflow-hidden mb-4">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                  <img
                    src="/images/women-collage.png"
                    alt="Women's dress inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-10 bg-[#D6E8F5] flex flex-col justify-center">
                  <span className="text-gold text-3xl block mb-5">◇</span>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-2">For</p>
                  <h2 className="font-serif text-3xl font-light text-ink mb-1">Women</h2>
                  <p className="font-sans text-[12px] text-ink/50 font-light mb-6">Western formal</p>
                  <div className="h-px bg-ink/10 mb-6" />
                  <p className="font-sans font-light text-[14px] text-ink/75 leading-relaxed mb-8">
                    Formal attire in shades of <strong className="font-normal text-ink">blue</strong>, <strong className="font-normal text-ink">soft pink</strong>, and <strong className="font-normal text-ink">purple</strong>. Think floor-length gowns, elegant midi dresses, or formal western-inspired looks.
                  </p>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-ink/40 mb-4">Colour palette</p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {womenPalette.map(swatch => (
                      <div key={swatch.label} className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 rounded-full border border-ink/15 shadow-sm" style={{ backgroundColor: swatch.color }} />
                        <span className="font-sans text-[9px] tracking-wide text-ink/40">{swatch.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-ink/15 bg-white/40 px-5 py-4 mb-8">
                    <p className="font-sans text-[10px] tracking-extreme uppercase text-ink/40 mb-2">Please avoid</p>
                    <p className="font-sans font-light text-[13px] text-ink/65">
                      Dark or loud colours · White, cream, or ivory · Heavy prints
                    </p>
                  </div>
                  <a
                    href="https://pin.it/4zDb89A9O"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-sans text-[10px] tracking-extreme uppercase border border-gold text-gold px-6 py-3 hover:bg-gold/10 transition-colors duration-300"
                  >
                    <span>View Inspiration on Pinterest</span>
                    <span className="text-gold/60">↗</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Men */}
            <div className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-stone-900">
                  <img
                    src="/images/men-collage.png"
                    alt="Men's dress inspiration"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 md:p-10 bg-[#FAF6F0] flex flex-col justify-center">
                  <span className="text-gold text-3xl block mb-5">◇</span>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-gold mb-2">For</p>
                  <h2 className="font-serif text-3xl font-light text-ink mb-1">Men</h2>
                  <p className="font-sans text-[12px] text-ink/50 font-light mb-6">Western formal</p>
                  <div className="h-px bg-ink/10 mb-6" />
                  <p className="font-sans font-light text-[14px] text-ink/75 leading-relaxed mb-8">
                    <strong className="font-normal text-ink">Light coloured western suits</strong> are preferred. Think linen, stone, sand, sage, or slate blue. Pair with a dress shirt and dress shoes.
                  </p>
                  <p className="font-sans text-[10px] tracking-extreme uppercase text-ink/40 mb-4">Colour palette</p>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {menPalette.map(swatch => (
                      <div key={swatch.label} className="flex flex-col items-center gap-2">
                        <div className="w-9 h-9 rounded-full border border-ink/15 shadow-sm" style={{ backgroundColor: swatch.color }} />
                        <span className="font-sans text-[9px] tracking-wide text-ink/40">{swatch.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border border-ink/15 bg-white/60 px-5 py-4 mb-8">
                    <p className="font-sans text-[10px] tracking-extreme uppercase text-ink/40 mb-2">Please avoid</p>
                    <p className="font-sans font-light text-[13px] text-ink/65">
                      Black suits or trousers · Dark navy · Casual or smart-casual attire
                    </p>
                  </div>
                  <a
                    href="https://pin.it/6So7z5Y99"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-sans text-[10px] tracking-extreme uppercase border border-gold text-gold px-6 py-3 hover:bg-gold/10 transition-colors duration-300"
                  >
                    <span>View Inspiration on Pinterest</span>
                    <span className="text-gold/60">↗</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom note */}
          <motion.div
            className="bg-burgundy text-white p-10 text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold/50 text-2xl block mb-5">◆</span>
            <h3 className="font-serif text-2xl font-light text-white mb-4">
              A note on colours
            </h3>
            <p className="font-sans font-light text-[14px] text-white/65 leading-relaxed max-w-md mx-auto">
              If you're ever unsure about your outfit, feel free to reach out to us.
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
