import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { business } from '../content.js'

const links = [
  { to: '/memberships', label: 'Memberships' },
  { to: '/waiver', label: 'Waiver' },
  { to: '/#gift-cards', label: 'Gift cards' },
  { to: '/#faqs', label: 'FAQs' },
  { to: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  useEffect(() => {
    setOpen(false)
  }, [pathname, hash])

  return (
    <header className="nav">
      <a href="#main" className="skip-link">Skip to main content</a>
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">⛳</span>
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
          <Link to="/book" className="btn btn-primary btn-sm">Book a tee time</Link>
        </nav>
      </div>
    </header>
  )
}
