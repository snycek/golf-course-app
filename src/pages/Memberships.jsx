import { Link } from 'react-router-dom'
import { memberships as m } from '../content.js'

export default function Memberships() {
  return (
    <section className="page fill">
      <div className="container plans-layout">
        <div className="plans-intro">
          <p className="eyebrow">Memberships</p>
          <h1>Make golf a habit.</h1>
          <p className="muted">Monthly studio hours, member pricing, room for your group.</p>
          <p className="muted small">
            Not ready? <Link to="/book">Book an hour</Link> — from $40.
          </p>
          <details className="faq">
            <summary>Membership rules</summary>
            <ul className="checks">{m.guidelines.map((g) => <li key={g}>{g}</li>)}</ul>
          </details>
        </div>
        {m.tiers.map((t) => (
          <article key={t.name} className={`plan ${t.badge ? 'plan-featured' : ''}`}>
            {t.badge && <span className="badge">{t.badge}</span>}
            <h3>{t.name}</h3>
            <p className="price">{t.price}<span>/mo</span></p>
            <ul className="checks">{t.includes.map((i) => <li key={i}>{i}</li>)}</ul>
            <a href={m.signupUrl} target="_blank" rel="noreferrer" className={`btn btn-block ${t.badge ? 'btn-primary' : 'btn-outline'}`}>
              Choose {t.name}
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
