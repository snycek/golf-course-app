import { faqs, business } from '../content.js'

export default function Faq() {
  return (
    <section className="page fill">
      <div className="container split-page">
        <div>
          <p className="eyebrow">FAQ</p>
          <h1>Good to know</h1>
          <p className="muted">
            Anything else? <a href={`tel:${business.phone}`}>{business.phone}</a> or{' '}
            <a href={`mailto:${business.email}`}>email us</a>.
          </p>
        </div>
        <div className="scroll-panel">
          {faqs.map((f) => (
            <details key={f.q} className="faq">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
