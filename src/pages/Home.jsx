import { Link } from 'react-router-dom'
import { business, features, rates, hours } from '../content.js'

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Powered by Trackman Range</p>
          <h1>{business.name}</h1>
          <p className="lead">{business.tagline}</p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a bay</Link>
            <Link to="/rates" className="btn btn-ghost">See rates</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="intro">{business.description}</p>
          <div className="card-grid">
            {features.map((f, i) => (
              <article key={i} className="card">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <h2>Rates</h2>
            <Link to="/rates" className="link-arrow">All rates →</Link>
          </div>
          <div className="card-grid">
            {rates.map((r, i) => (
              <article key={i} className="card rate-card">
                <h3>{r.name}</h3>
                <p className="price">{r.price} <span>{r.unit}</span></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <h2>How it works</h2>
            <ol className="steps">
              <li><strong>Book online.</strong> Pick a bay and time.</li>
              <li><strong>Get your PIN.</strong> It comes with your confirmation.</li>
              <li><strong>Check in at your bay.</strong> Enter the PIN and start hitting.</li>
            </ol>
          </div>
          <div className="card">
            <h3>Hours</h3>
            <ul className="hours-list">
              {hours.map((h, i) => (
                <li key={i}><span>{h.days}</span><span>{h.time}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <h2>Ready to tee it up?</h2>
          <Link to="/book" className="btn btn-light">Book your bay</Link>
        </div>
      </section>
    </>
  )
}
