import { useOutletContext } from 'react-router-dom'
import { useApi } from '../lib/auth.jsx'
import HBarChart from '../components/charts/HBarChart.jsx'
import LineChart from '../components/charts/LineChart.jsx'
import NoMembership from './NoMembership.jsx'
import { fmtDate, fmtNum } from '../lib/format.js'

function Tile({ label, value, sub }) {
  return (
    <div className="tile">
      <span className="tile-label">{label}</span>
      <strong className="tile-value">{value ?? '—'}</strong>
      {sub && <span className="tile-sub">{sub}</span>}
    </div>
  )
}

export default function Stats() {
  const { data: me } = useOutletContext()
  const stats = useApi('/api/me/stats')
  if (!me.member) return <NoMembership email={me.email} />
  if (stats.loading && !stats.data) return <div className="portal-loading" />
  if (stats.error) return <p className="error">{stats.error.message}</p>
  const s = stats.data

  return (
    <>
      <header className="portal-head">
        <h1>Your game</h1>
        {s.source === 'sample' && (
          <span className="pill pill-muted" title="Real TrackMan data will appear here once connected.">Sample data</span>
        )}
      </header>

      <div className="tiles">
        <Tile label="Sessions" value={fmtNum(s.totals.sessions)} sub={`${s.last30.sessions} in last 30 days`} />
        <Tile label="Shots" value={fmtNum(s.totals.shots)} />
        <Tile label="Ball speed" value={s.last30.avgBallSpeed || null} sub="mph · 30-day avg" />
        <Tile label="Best round" value={s.bestScore} sub={s.avgScore ? `avg ${s.avgScore}` : 'no rounds yet'} />
      </div>

      <div className="dash-grid">
        <article className="panel">
          <h2>Driver carry</h2>
          <LineChart
            ariaLabel="Driver carry distance per session"
            data={s.driverTrend.map((p) => ({ x: p.date, y: p.carry }))}
            formatX={(d) => fmtDate(d)}
            formatY={(v) => `${Math.round(v)} yd`}
          />
        </article>
        <article className="panel">
          <h2>Carry by club</h2>
          <p className="panel-sub">Last 30 days</p>
          <HBarChart
            ariaLabel="Average carry distance by club"
            data={s.carryByClub}
            label={(d) => d.club}
            value={(d) => d.carry}
            unit=" yd"
          />
        </article>
        {s.scoreTrend.length > 1 && (
          <article className="panel">
            <h2>Scores</h2>
            <p className="panel-sub">Lower is better</p>
            <LineChart
              ariaLabel="Round scores over time"
              data={s.scoreTrend.map((p) => ({ x: p.date, y: p.score, note: p.course }))}
              formatX={(d) => fmtDate(d)}
              formatY={(v) => String(Math.round(v))}
              invert
            />
          </article>
        )}
        <article className="panel">
          <h2>Recent sessions</h2>
          <div className="table-wrap flat">
            <table className="table">
              <thead><tr><th>Date</th><th>Type</th><th>Shots</th><th>Driver</th><th>Score</th></tr></thead>
              <tbody>
                {s.recentSessions.map((r) => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.date)}</td>
                    <td>{r.kind === 'round' ? r.course : 'Practice'}</td>
                    <td>{r.shots}</td>
                    <td>{Math.round(r.carry.Driver)} yd</td>
                    <td>{r.score ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </>
  )
}
