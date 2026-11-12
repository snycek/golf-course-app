import PageHeader from '../components/PageHeader.jsx'
import { business, hours } from '../content.js'

export default function Contact() {
  const { address } = business
  return (
    <>
      <PageHeader eyebrow="Get in touch" title="Contact" />
      <section className="section">
        <div className="container card-grid">
          <article className="card">
            <h3>Call or email</h3>
            <p><a href={`tel:${business.phone}`}>{business.phone}</a></p>
            <p><a href={`mailto:${business.email}`}>{business.email}</a></p>
          </article>
          <article className="card">
            <h3>Find us</h3>
            <p>{address.line1}<br />{address.city}, {address.state} {address.zip}</p>
            {business.mapUrl && (
              <a className="link-arrow" href={business.mapUrl} target="_blank" rel="noreferrer">Get directions →</a>
            )}
          </article>
          <article className="card">
            <h3>Hours</h3>
            <ul className="hours-list">
              {hours.map((h, i) => (
                <li key={i}><span>{h.days}</span><span>{h.time}</span></li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </>
  )
}
