import { Link } from 'react-router-dom'
import { business } from '../content.js'

export default function NoMembership({ email }) {
  return (
    <div className="empty">
      <h2>No active membership</h2>
      <p className="muted">
        We couldn’t find a membership for <b>{email}</b>. If you just joined, it may take a day to appear —
        or <a href={`mailto:${business.email}`}>let us know</a>.
      </p>
      <Link to="/memberships" className="btn btn-primary">View plans</Link>
    </div>
  )
}
