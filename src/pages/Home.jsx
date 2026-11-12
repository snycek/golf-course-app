import { Link } from 'react-router-dom'
import Steps from '../components/Steps.jsx'
import {
  business, booking, hero, highlights, howItWorks, why, options, tech, giftCards, faqs,
} from '../content.js'

export default function Home() {
  const { address } = business
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>
            {hero.title} <span className="accent">{hero.titleAccent}</span>
          </h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a tee time</Link>
            <a href="#how-it-works" className="btn btn-ghost">See how it works</a>
          </div>
          <p className="hero-note">{hero.priceNote}</p>
        </div>
        <div className="container">
          <ul className="highlights">
            {highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
      </section>

      <section className="section" id="how-it-works">
        <div className="container">
          <p className="eyebrow">How it works</p>
          <h2>{howItWorks.title}</h2>
          <p className="lead muted">{howItWorks.lead}</p>
          <Steps steps={howItWorks.steps} />
          <Link to="/book" className="btn btn-primary">Reserve your session</Link>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container split">
          <div>
            <h2>{why.title}</h2>
            <p className="lead muted">{why.body}</p>
            <Link to="/book" className="btn btn-primary">Book your private studio</Link>
          </div>
          <ul className="checks checks-lg card">
            {why.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{options.title}</h2>
          <p className="lead muted">{options.lead}</p>
          <div className="card-grid">
            {options.items.map((o) => (
              <article key={o.key} className="card">
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                {o.price && <p className="price-tag">{o.price}</p>}
                {o.to ? (
                  <Link to={o.to} className="btn btn-outline btn-block">{o.cta}</Link>
                ) : (
                  <a href={o.href} className="btn btn-outline btn-block">{o.cta}</a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <p className="eyebrow">Technology</p>
          <h2>{tech.title}</h2>
          <p className="lead">{tech.lead}</p>
          <div className="card-grid card-grid-4">
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
          <div className="gift card">
            <div>
              <p className="eyebrow">Gift cards</p>
              <h2>{giftCards.title}</h2>
              <p className="muted">{giftCards.body}</p>
            </div>
            <a href={booking.giftCardUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
              Buy a gift card ↗
            </a>
          </div>
        </div>
      </section>

      <section className="section section-alt" id="faqs">
        <div className="container narrow">
          <p className="eyebrow">FAQs</p>
          <h2>Good to know</h2>
          {faqs.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container card-grid">
          <article className="card">
            <p className="eyebrow">Find us</p>
            <h3>{business.name}</h3>
            <p>{address.line1}<br />{address.city}, {address.state} {address.zip}</p>
            <p><strong>{business.hoursNote}</strong></p>
            <a className="link-arrow" href={business.mapUrl} target="_blank" rel="noreferrer">Get directions →</a>
          </article>
          <article className="card">
            <p className="eyebrow">Contact us</p>
            <h3>Questions or events?</h3>
            <p>Phone: <a href={`tel:${business.phone}`}>{business.phone}</a></p>
            <p>Email: <a href={`mailto:${business.email}`}>{business.email}</a></p>
            <a className="link-arrow" href={booking.eventsMailto}>Plan a private event →</a>
          </article>
        </div>
      </section>
    </>
  )
}
