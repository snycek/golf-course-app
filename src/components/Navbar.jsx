import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { business } from '../content.js'
import { useAuth } from '../lib/auth.jsx'

const links = [
  { to: '/memberships', label: 'Memberships' },
  { to: '/waiver', label: 'Waiver' },
  { to: '/#gift-cards', label: 'Gift cards' },
  { to: '/#faqs', label: 'FAQ' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const { pathname, hash } = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  return (
    <header className="nav">
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="container nav-inner">
        <Link to="/" className="brand">
          {business.name}
        </Link>
        <button
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) =>
            l.to.includes('#') ? (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ) : (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ),
          )}
          <NavLink to={user ? '/portal' : '/login'} className="nav-member">{user ? 'My portal' : 'Member login'}</NavLink>
          <Link to="/book" className="btn btn-primary btn-sm">Book</Link>
        </nav>
      </div>
    </header>
  )
}
