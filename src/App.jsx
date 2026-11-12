import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/auth.jsx'
import Navbar from './components/Navbar.jsx'
import Crest from './components/Crest.jsx'
import Footer from './components/Footer.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import Home from './pages/Home.jsx'
import Book from './pages/Book.jsx'
import Memberships from './pages/Memberships.jsx'
import Waiver from './pages/Waiver.jsx'
import Admin from './pages/Admin.jsx'
import Faq from './pages/Faq.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './portal/Login.jsx'
import PortalLayout from './portal/PortalLayout.jsx'
import Overview from './portal/Overview.jsx'
import Stats from './portal/Stats.jsx'
import Account from './portal/Account.jsx'

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
      <Crest className="watermark" />
      <img src="/swordfish-mark.png" alt="" className="sf-mark" aria-hidden="true" />
      <ScrollManager />
      <Navbar />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<Book />} />
          <Route path="/memberships" element={<Memberships />} />
          <Route path="/waiver" element={<Waiver />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<Overview />} />
            <Route path="stats" element={<Stats />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
          {/* Old Wix URLs, so existing links and Google results keep working */}
          <Route path="/hourly-bookings" element={<Navigate to="/book" replace />} />
          <Route path="/private-events" element={<Navigate to="/waiver" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </AuthProvider>
  )
}
