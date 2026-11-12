import PageHeader from '../components/PageHeader.jsx'
import BookingWidget from '../components/BookingWidget.jsx'

export default function Book() {
  return (
    <>
      <PageHeader eyebrow="Reserve" title="Book a bay">
        Choose a time, then check in at your bay with the PIN from your confirmation.
      </PageHeader>
      <section className="section">
        <div className="container">
          <BookingWidget />
        </div>
      </section>
    </>
  )
}
