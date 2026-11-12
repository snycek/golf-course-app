import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import Steps from '../components/Steps.jsx'
import { memberships as m } from '../content.js'

const STEPS = [
  { title: 'Join', body: 'Choose Silver or Gold.' },
  { title: 'Book', body: 'Sign in and apply your hours.' },
  { title: 'Play', body: 'Codes arrive by email.' },
]

export default function Memberships() {
  return (
    <>
      <PageHeader eyebrow="Memberships" title="Make golf a habit.">
        Monthly studio hours, member pricing, room for your group.
      </PageHeader>

      <section className="section">
        <div className="container">
          <div className="plans">
            {m.tiers.map((t) => (
              <article key={t.name} className={`plan ${t.badge ? 'plan-featured' : ''}`}>
                {t.badge && <span className="badge">{t.badge}</span>}
                <h3>{t.name}</h3>
                <p className="price">{t.price}<span>/mo</span></p>
                <ul className="checks">
                  {t.includes.map((i) => <li key={i}>{i}</li>)}
                </ul>
                <a href={m.signupUrl} target="_blank" rel="noreferrer" className={`btn btn-block ${t.badge ? 'btn-primary' : 'btn-outline'}`}>
                  Choose {t.name}
                </a>
              </article>
            ))}
          </div>
          <p className="center muted plans-alt">
            Not ready? <Link to="/book">Book an hour</Link> — from $40, no membership needed.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-intro"><h2>How it works</h2></div>
          <Steps steps={STEPS} />
        </div>
      </section>

      <section className="section">
        <div className="container narrow">
          <details className="faq">
            <summary>Membership guidelines</summary>
            <ul className="checks">
              {m.guidelines.map((g) => <li key={g}>{g}</li>)}
            </ul>
          </details>
          <p className="center"><Link to="/login" className="link-arrow">Already a member? Sign in →</Link></p>
        </div>
      </section>
    </>
  )
}
