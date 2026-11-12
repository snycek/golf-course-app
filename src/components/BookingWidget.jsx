import { booking } from '../content.js'

// TrackMan's booking calendar (yourgolfbooking.com) handles payment and emails
// the door and bay PINs.
export default function BookingWidget() {
  return (
    <div className="widget">
      <iframe src={booking.url} title="Booking calendar" loading="lazy" allow="payment" />
      <a href={booking.url} target="_blank" rel="noreferrer" className="widget-fallback">
        Calendar not loading? Open it in a new tab ↗
      </a>
    </div>
  )
}
