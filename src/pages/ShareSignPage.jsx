import { useLocation } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'

// The printed QR must always point at the live site, even if this page is
// opened from localhost or a Netlify preview.
const SHARE_URL = 'https://rummanandesther.com/share'

export default function ShareSignPage() {
  const { search } = useLocation()
  const code = new URLSearchParams(search).get('c')?.trim() ?? ''
  const shareUrl = code ? `${SHARE_URL}?c=${encodeURIComponent(code)}` : ''

  if (!shareUrl) {
    return (
      <p className="p-8 text-center">
        Add <code>?c=CODE</code> to the address to generate the QR sign.
      </p>
    )
  }

  return (
    <div className="print:flex print:flex-col print:items-center print:justify-center print:min-h-screen print:text-center print:bg-white print:text-black flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <p className="print:font-serif print:italic print:text-4xl print:mb-2">Rumman &amp; Esther</p>
      <h1 className="print:text-5xl print:mb-4 text-3xl mb-4">Share your photos &amp; videos with us</h1>
      <p className="print:text-lg print:mb-8 mb-8">Scan to upload — any angle, any moment</p>
      <QRCodeSVG value={shareUrl} size={320} level="M" />
      <p className="print:text-lg print:mt-8 mt-8">Scan the code, add your photos and videos, done.</p>
    </div>
  )
}
