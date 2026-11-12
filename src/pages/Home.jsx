import { Link } from 'react-router-dom'
import Steps from '../components/Steps.jsx'
import { business, booking, hero, highlights, howItWorks, options, tech, giftCards, faqs } from '../content.js'

export default function Home() {
  const { address } = business
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title} <em>{hero.titleAccent}</em></h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a tee time</Link>
            <Link to="/memberships" className="btn btn-ghost">Memberships</Link>
          </div>
          <ul className="highlights">
            {highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-intro">
            <h2>{howItWorks.title}</h2>
            <p className="muted">{howItWorks.lead}</p>
          </div>
          <Steps steps={howItWorks.steps} />
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro"><h2>{options.title}</h2></div>
          <div className="card-grid">
            {options.items.map((o) => (
              <article key={o.key} className="card option">
                <span className="option-price">{o.price}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                {o.to ? (
                  <Link to={o.to} className="link-arrow">{o.cta} →</Link>
                ) : (
                  <a href={o.href} className="link-arrow">{o.cta} →</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <div className="section-intro"><h2>{tech.title}</h2></div>
          <div className="tech-grid">
            {tech.items.map((t) => (
              <article key={t.title} className="tech-item">
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="gift-cards">
        <div className="container">
          <div className="band">
            <div>
              <h2>{giftCards.title}</h2>
              <p className="muted">{giftCards.body}</p>
            </div>
            <a href={booking.giftCardUrl} target="_blank" rel="noreferrer" className="btn btn-primary">Buy a gift card</a>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="faqs">
        <div className="container narrow">
          <div className="section-intro"><h2>FAQ</h2></div>
          {faqs.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div>
            <h2>Visit</h2>
            <p className="lead-sm">{address.line1}<br />{address.city}, {address.state} {address.zip}</p>
            <p className="muted">{business.hoursNote}</p>
            <a className="link-arrow" href={business.mapUrl} target="_blank" rel="noreferrer">Directions →</a>
          </div>
          <div>
            <h2>Contact</h2>
            <p className="lead-sm">
              <a href={`tel:${business.phone}`}>{business.phone}</a><br />
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </p>
            <a className="link-arrow" href={booking.eventsMailto}>Plan a private event →</a>
          </div>
        </div>
      </section>
    </>
  )
}
