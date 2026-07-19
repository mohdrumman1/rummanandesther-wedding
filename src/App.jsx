import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import SaveTheDatePage from './pages/SaveTheDatePage'
import EventsPage from './pages/EventsPage'
import DressCodePage from './pages/DressCodePage'
import RegistryPage from './pages/RegistryPage'
import AccommodationPage from './pages/AccommodationPage'
import RsvpPage from './pages/RsvpPage'
import RsvpAdminPage from './pages/RsvpAdminPage'

export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <ScrollToTop />
      <Nav />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/save-the-date" element={<SaveTheDatePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/dress-code" element={<DressCodePage />} />
            <Route path="/registry" element={<RegistryPage />} />
            <Route path="/accommodation" element={<AccommodationPage />} />
            <Route path="/rsvp" element={<RsvpPage key={location.pathname} />} />
            <Route path="/rsvp/:accessCode" element={<RsvpPage key={location.pathname} />} />
            <Route path="/admin" element={<RsvpAdminPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}
