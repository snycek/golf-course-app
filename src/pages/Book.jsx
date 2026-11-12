import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import BookingWidget from '../components/BookingWidget.jsx'
import Steps from '../components/Steps.jsx'
import { bookPage } from '../content.js'

export default function Book() {
  return (
    <>
      <PageHeader eyebrow="Book now" title={bookPage.title} note={bookPage.note}>
        {bookPage.lead}
      </PageHeader>
      <section className="section section-tight">
        <div className="container">
          <BookingWidget />
        </div>
      </section>
      <section className="section section-alt">
        <div className="container split">
          <div>
            <p className="eyebrow">Before you book</p>
            <h2>What happens next</h2>
            <ul className="checks checks-lg">
              {bookPage.beforeYouBook.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
          <div className="card safety">
            <h3>Safety first</h3>
            <p>{bookPage.safety}</p>
            <Link to="/waiver" className="btn btn-primary btn-block">Sign the waiver</Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Steps steps={bookPage.steps} />
          <p className="muted small">{bookPage.agreement}</p>
        </div>
      </section>
    </>
  )
}
