import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Steps from '../components/Steps.jsx'
import { memberships as m } from '../content.js'

export default function Memberships() {
  return (
    <>
      <PageHeader eyebrow={m.eyebrow} title={m.title}>{m.lead}</PageHeader>

      <section className="section">
        <div className="container">
          <div className="card-grid">
            {m.benefits.map((b) => (
              <article key={b.title} className="card">
                <h3>{b.title}</h3>
                <p>{b.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt" id="membership-plans">
        <div className="container">
          <p className="eyebrow">Membership plans</p>
          <h2>{m.plansTitle}</h2>
          <p className="lead muted">{m.plansLead}</p>
          <div className="plans">
            {m.tiers.map((t) => (
              <article key={t.name} className={`card plan ${t.badge ? 'plan-featured' : ''}`}>
                {t.badge && <span className="badge">{t.badge}</span>}
                <h3>{t.name} membership</h3>
                <p className="price">{t.price}<span>/month</span></p>
                <ul className="checks">
                  {t.includes.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <a href={m.signupUrl} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">
                  Choose {t.name} ↗
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="gift card">
            <div>
              <h2>{m.notReady.title}</h2>
              <p className="muted">{m.notReady.body}</p>
            </div>
            <Link to="/book" className="btn btn-primary">Book an hourly session</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <p className="eyebrow">How memberships work</p>
          <h2>Memberships made simple</h2>
          <Steps steps={m.steps} />
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <p className="eyebrow">Membership guidelines</p>
          <h2>A few things to know</h2>
          <ul className="checks checks-lg">
            {m.guidelines.map((g) => <li key={g}>{g}</li>)}
          </ul>
        </div>
      </section>
    </>
  )
}
