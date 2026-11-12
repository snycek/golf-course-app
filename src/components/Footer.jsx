import { Link } from 'react-router-dom'
import { business, booking } from '../content.js'

export default function Footer() {
  const { address } = business
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-light">{business.name}</div>
          <p className="muted-light">Private TrackMan studio in {business.location}. {business.hoursNote}.</p>
        </div>
        <div>
          <h4>Visit</h4>
          <p>
            {address.line1}<br />
            {address.city}, {address.state} {address.zip}
          </p>
          <a href={business.mapUrl} target="_blank" rel="noreferrer">Directions →</a>
        </div>
        <div>
          <h4>Contact</h4>
          <p>
            <a href={`tel:${business.phone}`}>{business.phone}</a><br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/book">Book a tee time</Link></li>
            <li><Link to="/memberships">Memberships</Link></li>
            <li><Link to="/waiver">Waiver</Link></li>
            <li><a href={booking.giftCardUrl} target="_blank" rel="noreferrer">Gift cards</a></li>
            <li><Link to="/#faqs">FAQs</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {business.name}. All rights reserved.
      </div>
    </footer>
  )
}
