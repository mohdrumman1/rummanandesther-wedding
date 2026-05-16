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
    distance: 'At the venue',
    location: 'Lovedale',
    desc: 'Resort accommodation right at the reception venue on Wine Country Drive. No transfers needed.',
    note: 'Our top recommendation. Book early as rooms fill fast.',
    image: 'https://assets.atdw-online.com.au/images/cb51c8a2e2a99198e70898fe84e7e388.jpeg?rect=116%2C0%2C2996%2C2247&w=800&h=600&fm=jpg',
    link: 'https://www.rydges.com/accommodation/regional-nsw/hunter-valley/',
  },
  {
    name: 'Potters Resort',
    stars: '★★★★',
    distance: '2.9 km away',
    location: 'Nulkaba',
    desc: 'Comfortable self-contained apartments in Nulkaba, just a short drive from the reception. Good for families or those wanting more space.',
    note: 'A great value option close to the venue.',
    image: 'https://pottersapartments.com/wp-content/uploads/2024/03/WEB_Potters-Apartments_001_6.jpg',
    link: 'https://pottersapartments.com/',
  },
  {
    name: 'Mercure Hunter Valley Gardens',
    stars: '★★★★',
    distance: '4.6 km away',
    location: 'Pokolbin',
    desc: 'Well-appointed hotel set within the famous Hunter Valley Gardens precinct. Reliable, full-service accommodation with on-site dining.',
    note: 'Ideal for guests wanting an easy, comfortable stay.',
    image: 'https://www.mercurehuntervalley.com.au/client_images/2263919.jpg',
    link: 'https://www.mercurehuntervalley.com.au/',
  },
  {
    name: 'Chateau Elan at The Vintage',
    stars: '★★★★★',
    distance: '5.1 km away',
    location: 'Pokolbin',
    desc: 'Luxury resort set on a private golf course with a spa, multiple restaurants, and beautifully appointed rooms.',
    note: 'Perfect for those looking to make a weekend of it.',
    image: 'https://assets.atdw-online.com.au/images/867b8f79fb0e6846db1db508cfddbf2e.jpeg?w=800&h=600&fm=jpg',
    link: 'https://chateauelan.com.au/',
  },
  {
    name: 'voco Kirkton Park Hunter Valley',
    stars: '★★★★',
    distance: '5.1 km away',
    location: 'Pokolbin',
    desc: 'Elegant country house hotel with manicured gardens, a pool, restaurant, and wine bar. A classic Hunter Valley stay.',
    note: 'A beautiful and relaxed base for the weekend.',
    image: 'https://assets.atdw-online.com.au/images/cd1b8381cb162bf4a99013e6af424163.jpeg?rect=160%2C0%2C2560%2C1920&w=800&h=600&fm=jpg',
    link: 'https://huntervalley.vocohotels.com/',
  },
  {
    name: 'Oaks Cypress Lakes Resort',
    stars: '★★★★',
    distance: '5.5 km away',
    location: 'Pokolbin',
    desc: 'Spacious villas and apartments set around a championship golf course. Great for groups or families needing extra room.',
    note: 'Good value with plenty of space.',
    image: 'https://assets.atdw-online.com.au/images/e816d2accc4754988582ab0324756867.jpeg?rect=133%2C0%2C2133%2C1600&w=800&h=600&fm=jpg',
    link: 'https://www.oakshotels.com/en/oaks-cypress-lakes-resort',
  },
  {
    name: 'The Convent Hunter Valley',
    stars: '★★★★',
    distance: 'Pokolbin',
    location: 'Pokolbin',
    desc: 'Boutique hotel in a restored heritage building surrounded by vineyards. Intimate, characterful, and beautifully styled.',
    note: 'A romantic option for couples.',
    image: 'https://cdn.sanity.io/images/i45duoi3/production/e0c977196eafeb5d00da76e45ff7d6c0e4566d0d-8064x6048.jpg/DJI_0029%20(1).jpg?w=800&h=600&auto=format',
    link: 'https://www.convent.com.au/',
  },
  {
    name: 'Leisure Inn Pokolbin Hill',
    stars: '★★★',
    distance: 'Pokolbin',
    location: 'Pokolbin',
    desc: 'A no-fuss, comfortable motel-style option in Pokolbin with easy access to the Hunter Valley wine region.',
    note: 'A budget-friendly choice for guests keeping things simple.',
    image: 'https://d18slle4wlf9ku.cloudfront.net/seibuprince.com-1509694152/cms/cache/v2/66024988c6b70.jpg/1920x1080/fit/80/f6d727bb39377891181740791fec1d7e.jpg',
    link: 'https://www.leisureinnpokolbinhill.com.au/',
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
        <div className="max-w-5xl mx-auto">

          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans font-light text-[15px] text-ink/65 leading-relaxed max-w-xl mx-auto">
              Below are some local hotel suggestions sorted by distance from the reception venue.
              Please book early as December is a busy time in the Hunter Valley.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {hotels.map((hotel, i) => (
              <motion.div
                key={hotel.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07 }}
                className="border border-gold/25 bg-white flex flex-col overflow-hidden group"
              >
                {/* Photo */}
                <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif text-lg font-light text-ink leading-snug">{hotel.name}</h3>
                    <span className="font-sans text-[10px] text-gold/70 flex-shrink-0 mt-1">{hotel.stars}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-sans text-[11px] text-ink/40 font-light">{hotel.location}</span>
                    <span className="text-gold/30">·</span>
                    <span className="font-sans text-[11px] text-gold/80 font-light">{hotel.distance}</span>
                  </div>

                  <div className="h-px bg-gold/15 mb-4" />

                  <p className="font-sans font-light text-[13px] text-ink/65 leading-relaxed mb-3 flex-1">
                    {hotel.desc}
                  </p>

                  <p className="font-sans text-[12px] text-gold font-light italic mb-5">
                    {hotel.note}
                  </p>

                  <a
                    href={hotel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto font-sans text-[10px] tracking-extreme uppercase border border-gold/40 text-gold px-5 py-3 text-center hover:bg-gold hover:text-white transition-all duration-300"
                  >
                    Visit Website →
                  </a>
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
            <p className="font-sans font-light text-[14px] text-white/65 leading-relaxed max-w-md mx-auto mb-6">
              If you have any questions about getting to Hunter Valley or finding somewhere
              to stay, please don't hesitate to reach out to us.
            </p>
            <a
              href="mailto:mohdrumman1@gmail.com"
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
