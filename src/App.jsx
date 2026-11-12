import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import Home from './pages/Home.jsx'
import Book from './pages/Book.jsx'
import Memberships from './pages/Memberships.jsx'
import Waiver from './pages/Waiver.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/waiver" element={<Waiver />} />
          {/* Old Wix URLs, so existing links and Google results keep working */}
          <Route path="/hourly-bookings" element={<Navigate to="/book" replace />} />
          <Route path="/private-events" element={<Navigate to="/waiver" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
