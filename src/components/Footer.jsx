import { Link } from 'react-router-dom'
import { business, booking } from '../content.js'

export default function Footer() {
  const { address } = business
  return (
    <footer className="footer" id="contact">
      <div className="container footer-row">
        <div className="footer-info">
          <div className="brand brand-light">{business.name}</div>
          <a href={business.mapUrl} target="_blank" rel="noreferrer">{address.line1}, {address.city}</a>
          <a href={`tel:${business.phone}`}>{business.phone}</a>
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span className="muted-light">Open 24/7</span>
        </div>
        <nav className="footer-links">
          <Link to="/waiver">Waiver</Link>
          <a href={booking.giftCardUrl} target="_blank" rel="noreferrer">Gift cards</a>
          <a href={booking.eventsMailto}>Events</a>
        </nav>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} {business.name}</div>
    </footer>
  )
}
