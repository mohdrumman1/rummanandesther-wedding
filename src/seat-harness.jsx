import { createRoot } from 'react-dom/client'
import './index.css'
import SeatingPlanner from './components/SeatingPlanner'
let saved = null
window.__saved = () => saved
window.fetch = async (url, opts = {}) => {
  const u = String(url)
  if (u.includes('/api/admin/seating') && opts.method === 'PUT') { saved = JSON.parse(opts.body).plan; return new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } }) }
  return new Response(JSON.stringify({ plan: null }), { headers: { 'content-type': 'application/json' } })
}
const names = ['Anne Thomas','Alex Thomas','Priya Nair','Raj Nair','Maya Nair','Sam Joseph','Lena Joseph','Tom Baker','Julia Baker','Dr Sinija','Peter Rodrigues','Esther Paul','Mohd Rumman','Asha George','Ben George','Cara Lee','Dan Lee','Eve Kim','Finn Kim','Gus Park','Hana Park','Ivy Chen','Jack Chen','Kai Wong']
const groups = []
for (let i = 0; i < names.length; i += 2) groups.push({ householdName: names[i].split(' ')[1] + ' household', rsvp: { dietaryRequirements: i === 4 ? 'Vegan' : '' }, guests: [i, i + 1].map(k => ({ id: 'g' + k, name: names[k], receptionInvited: true, receptionAttending: k === 5 ? false : true })) })
window.__groups = groups
createRoot(document.getElementById('root')).render(<SeatingPlanner groups={groups} />)
const out = document.createElement('pre'); out.id = 'out'; document.body.appendChild(out)
const blobs = {}
const origCreate = URL.createObjectURL.bind(URL)
URL.createObjectURL = b => { const u = origCreate(b); blobs[u] = b; return u }
HTMLAnchorElement.prototype.click = function () {
  const b = blobs[this.href]; if (!b) return
  const r = new FileReader(); r.onload = () => { const el = document.createElement('div'); el.className = 'dl'; el.dataset.name = this.download; el.textContent = r.result; out.appendChild(el) }; r.readAsDataURL(b)
}
const btn = t => [...document.querySelectorAll('button')].find(b => b.textContent.includes(t))
setTimeout(() => {
  for (let i = 0; i < 4; i++) setTimeout(() => btn("+ Round table").click(), i * 30)
  setTimeout(() => btn('+ Long table').click(), 150)
  setTimeout(() => btn('+ Dance floor').click(), 250)
}, 300)
setTimeout(() => { btn('Auto-seat').click() }, 700)
setTimeout(() => { btn('Download PDF').click() }, 1200)
setTimeout(() => { btn('Download image').click() }, 4000)
