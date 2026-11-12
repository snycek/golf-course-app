import { Link } from 'react-router-dom'
import HeroSlides from '../components/HeroSlides.jsx'
import Crest from '../components/Crest.jsx'
import { heroImages, booking, memberships } from '../content.js'

const RATES = [
  { name: 'Hourly', note: 'Whole studio, up to 6', price: 'from $40/hr', to: '/book' },
  { name: 'Silver membership', note: '3 hrs a month', price: `${memberships.tiers[0].price}/mo`, to: '/memberships' },
  { name: 'Gold membership', note: '6 hrs a month', price: `${memberships.tiers[1].price}/mo`, to: '/memberships' },
  { name: 'Private events', note: 'Birthdays, outings, golf nights', price: 'Inquire', href: booking.eventsMailto },
  { name: 'Gift cards', note: 'Any amount', price: 'Buy', href: booking.giftCardUrl, external: true },
]

export default function Home() {
  return (
    <section className="home fill">
      <HeroSlides images={heroImages} />
      <Crest className="home-crest" />
      <div className="container home-grid">
        <div className="home-hero">
          <h1>Your own private TrackMan studio.</h1>
          <p className="lead">Open 24/7 in Southgate. The whole studio, just your group.</p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a tee time</Link>
            <Link to="/memberships" className="text-link">See memberships</Link>
          </div>
        </div>

        <div className="rate-card">
          <h2>Ways to play</h2>
          <ul>
            {RATES.map((r) => {
              const inner = (
                <>
                  <span className="rate-name">{r.name}<small>{r.note}</small></span>
                  <span className="rate-dots" aria-hidden="true" />
                  <span className="rate-price">{r.price}</span>
                </>
              )
              return (
                <li key={r.name}>
                  {r.to ? (
                    <Link to={r.to}>{inner}</Link>
                  ) : (
                    <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{inner}</a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className="tech-line">
        <div className="container">
          <span>TrackMan iO</span>
          <span>Tour-level ball &amp; club data</span>
          <span>World-class courses</span>
          <span>True ball flight</span>
          <span>No front desk, no waiting</span>
        </div>
      </div>
    </section>
  )
}
