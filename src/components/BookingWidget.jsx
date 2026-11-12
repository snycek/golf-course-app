import { trackman, business } from '../content.js'

// Embeds Trackman's booking widget so bookings, PINs and bay unlocks keep
// flowing into Trackman exactly as they do on the current site.
export default function BookingWidget() {
  if (!trackman.bookingUrl) {
    return (
      <div className="widget-placeholder">
        <h3>Online booking coming soon</h3>
        <p>
          The Trackman booking widget goes here. Until then, call us at{' '}
          <a href={`tel:${business.phone}`}>{business.phone}</a> to reserve a bay.
        </p>
      </div>
    )
  }
  return (
    <div className="widget-frame">
      <iframe
        src={trackman.bookingUrl}
        title="Book a bay with Trackman"
        style={{ height: trackman.widgetHeight }}
        loading="lazy"
        allow="payment"
      />
      <p className="muted small">
        Trouble loading? <a href={trackman.bookingUrl} target="_blank" rel="noreferrer">Open booking in a new tab</a>.
      </p>
    </div>
  )
}
