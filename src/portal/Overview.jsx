import { Link, useOutletContext } from 'react-router-dom'
import HoursRing from '../components/charts/HoursRing.jsx'
import NoMembership from './NoMembership.jsx'
import { useApi } from '../lib/auth.jsx'
import { fmtDate, fmtLongDate, fmtHours } from '../lib/format.js'

function WaiverStatus({ waiver }) {
  if (waiver?.valid)
    return <span className="pill pill-ok">Waiver on file · until {fmtDate(waiver.expiresAt.slice(0, 10), { month: 'short', day: 'numeric', year: 'numeric' })}</span>
  return <Link to="/waiver" className="pill pill-warn">{waiver ? 'Waiver expired — renew' : 'Sign your waiver'}</Link>
}

export default function Overview() {
  const { data: me } = useOutletContext()
  const usage = useApi('/api/me/usage')
  const m = me.member
  if (!m || m.status === 'cancelled') return <NoMembership email={me.email} />
  const h = me.hours
  const first = (m.name || '').split(' ')[0]

  return (
    <>
      <header className="portal-head">
        <div>
          <h1>{first ? `Hi, ${first}` : 'Welcome'}</h1>
          <WaiverStatus waiver={me.waiver} />
        </div>
      </header>

      {m.status === 'paused' && <p className="notice">Your membership is paused.</p>}

      <div className="dash-grid">
        <article className="panel plan-panel">
          <span className="plan-chip">This cycle</span>
          {h ? (
            <>
              <HoursRing used={h.usedHours} total={h.includedHours} />
              <dl className="facts">
                <div><dt>Renews</dt><dd>{fmtDate(h.cycle.end)}</dd></div>
                <div><dt>Extra time</dt><dd>{h.plan.discountPct}% off</dd></div>
                <div><dt>Extra this cycle</dt><dd>{fmtHours(h.extraHours)}</dd></div>
              </dl>
            </>
          ) : (
            <p className="muted">Hours resume when your membership is active.</p>
          )}
        </article>

        <article className="panel">
          <h2>Recent visits</h2>
          {usage.data?.usage?.length ? (
            <ul className="visits">
              {usage.data.usage.slice(0, 6).map((u) => (
                <li key={u.id}>
                  <span>{fmtLongDate(u.date)}</span>
                  <span className="muted">{fmtHours(u.hours)}{u.type === 'extra' ? ' · extra' : ''}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">{usage.loading ? '…' : 'No visits yet.'}</p>
          )}
        </article>
      </div>
    </>
  )
}
