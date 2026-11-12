import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import { rates, faqs } from '../content.js'

export default function Rates() {
  return (
    <>
      <PageHeader eyebrow="Pricing" title="Rates" />
      <section className="section">
        <div className="container">
          <div className="card-grid">
            {rates.map((r, i) => (
              <article key={i} className="card rate-card">
                <h3>{r.name}</h3>
                <p className="price">{r.price} <span>{r.unit}</span></p>
                <ul className="checks">
                  {r.details.map((d, j) => <li key={j}>{d}</li>)}
                </ul>
                <Link to="/book" className="btn btn-primary btn-block">Book</Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-alt">
        <div className="container narrow">
          <h2>FAQ</h2>
          {faqs.map((f, i) => (
            <details key={i} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
