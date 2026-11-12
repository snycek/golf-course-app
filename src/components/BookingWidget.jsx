import { booking } from '../content.js'

// Embeds TrackMan's booking calendar (yourgolfbooking.com), which handles
// payment and emails the door and bay PINs. The button is the fallback the
// current site also offers when the calendar doesn't load.
export default function BookingWidget() {
  return (
    <div className="widget">
      <div className="widget-bar">
        <span>Having trouble viewing the calendar?</span>
        <a href={booking.url} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
          Open the booking calendar ↗
        </a>
      </div>
      <iframe src={booking.url} title="Teein’ It Up booking calendar" loading="lazy" allow="payment" />
    </div>
  )
}
