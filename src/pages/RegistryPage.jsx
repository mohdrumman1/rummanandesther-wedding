import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import PageHeader from '../components/PageHeader'

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

const payId = '0474199245'

function CopyButton({ value, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const copyValue = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <button type="button" onClick={copyValue} className="border border-gold/40 px-3 py-2 font-sans text-[10px] tracking-widest uppercase text-burgundy transition-colors hover:bg-gold/10">{copied ? 'Copied' : label}</button>
}

export default function RegistryPage() {
  const [showBankDetails, setShowBankDetails] = useState(false)
  // Keep the QR useful when it is printed or scanned from a phone during local testing.
  // Override with VITE_SITE_URL if the public domain ever changes.
  const publicSiteUrl = import.meta.env.VITE_SITE_URL || 'https://rummanandesther.com'
  const pageUrl = `${publicSiteUrl.replace(/\/$/, '')}/registry`

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Wishing Well" subtitle="Your presence is the greatest gift" />
      <section className="bg-cream px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mb-8 block text-4xl text-gold/40">◆</span>
          <h2 className="mb-6 font-serif text-4xl font-light text-ink md:text-5xl">No boxed gifts, please</h2>
          <div className="mx-auto max-w-xl space-y-5 font-sans text-[15px] font-light leading-relaxed text-ink/65">
            <p>Your presence is honestly more than enough. We’re not after boxed gifts, but if you’d like to contribute to our future together, we’ve set up a simple wishing well.</p>
            <p>No pressure at all — we’re just happy to celebrate with you.</p>
          </div>

          <div className="mx-auto mt-12 max-w-xl border border-gold/25 bg-white/40 p-7 text-left md:p-9">
            <p className="mb-3 font-sans text-[10px] tracking-ultra uppercase text-burgundy/70">Recommended · PayID®</p>
            <h3 className="mb-3 font-serif text-3xl font-light text-ink">Pay via your banking app</h3>
            <p className="mb-6 font-sans text-sm font-light leading-relaxed text-ink/60">Use the mobile PayID below, then check that the recipient name is <span className="text-ink">Mohammed Rumman Riyaz</span> before sending.</p>
            <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gold/15 py-4"><span className="font-sans text-lg tracking-wide text-ink">{payId}</span><CopyButton value={payId} label="Copy PayID" /></div>
            <p className="mt-4 font-sans text-xs font-light leading-relaxed text-ink/45">PayID® is a registered trade mark of NPP Australia Ltd ABN 68 601 428 737.</p>
          </div>

          <div className="mx-auto mt-8 max-w-xl border border-gold/20 bg-white/25 p-7 md:p-9">
            <button type="button" onClick={() => setShowBankDetails(!showBankDetails)} aria-expanded={showBankDetails} className="flex w-full items-center justify-between text-left"><span className="font-serif text-2xl font-light text-ink">Prefer bank transfer?</span><span className="font-sans text-xl font-light text-burgundy" aria-hidden="true">{showBankDetails ? '−' : '+'}</span></button>
            {showBankDetails && <div className="mt-6 border-t border-gold/15 pt-6"><p className="mb-5 font-sans text-sm font-light leading-relaxed text-ink/60">Please double-check the account name and numbers in your banking app before confirming.</p><div className="space-y-3 font-sans text-sm text-ink"><div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-gold/10 pb-3"><div className="text-left"><span className="text-ink/45">Account name</span><br />Mohammed Rumman Riyaz</div><CopyButton value="Mohammed Rumman Riyaz" /></div><div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-gold/10 pb-3"><div className="text-left"><span className="text-ink/45">BSB</span><br />062-948</div><CopyButton value="062-948" /></div><div className="grid grid-cols-[1fr_auto] items-center gap-4"><div className="text-left"><span className="text-ink/45">Account number</span><br />18668441</div><CopyButton value="18668441" /></div></div></div>}
          </div>

          <div className="mx-auto mt-12 max-w-xs"><div className="inline-block border border-gold/25 bg-white p-4"><QRCodeSVG value={pageUrl} size={176} bgColor="#ffffff" fgColor="#2f2024" includeMargin /></div><p className="mt-4 font-sans text-[11px] font-light leading-relaxed tracking-wide text-ink/50">Scan to open our public wishing-well page and choose your preferred way to contribute.</p></div>
          <p className="mx-auto mt-12 max-w-md font-sans text-xs font-light leading-relaxed text-ink/40">We don’t collect payment details or guest information here. Payments go directly to the account you choose above.</p>
        </div>
      </section>
    </motion.div>
  )
}
