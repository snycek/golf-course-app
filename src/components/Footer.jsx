import { Link } from 'react-router-dom'
import { business, hours } from '../content.js'

export default function Footer() {
  const { address } = business
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand brand-light">{business.name}</div>
          <p className="muted-light">{business.tagline}</p>
        </div>
        <div>
          <h4>Visit</h4>
          <p>
            {address.line1}<br />
            {address.city}, {address.state} {address.zip}
          </p>
          <p>
            <a href={`tel:${business.phone}`}>{business.phone}</a><br />
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        </div>
        <div>
          <h4>Hours</h4>
          <ul className="hours-list">
            {hours.map((h, i) => (
              <li key={i}><span>{h.days}</span><span>{h.time}</span></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/book">Book a bay</Link></li>
            <li><Link to="/rates">Rates</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {business.name}
      </div>
    </footer>
  )
}
