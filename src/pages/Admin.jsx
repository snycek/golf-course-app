import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, useApi } from '../lib/auth.jsx'
import { fmtDate, fmtHours, todayYmd } from '../lib/format.js'

const blankMember = { email: '', name: '', phone: '', plan: 'silver', status: 'active', billingDay: new Date().getDate(), notes: '' }

function MemberForm({ initial, onSaved, onCancel }) {
  const { api } = useAuth()
  const [f, setF] = useState(initial)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const editing = Boolean(initial.id)

  async function save(e) {
    e.preventDefault()
    setErr('')
    try {
      await api('/api/admin/members', { method: 'POST', body: JSON.stringify(f) })
      onSaved()
    } catch (e2) {
      setErr(e2.message)
    }
  }

  return (
    <form className="panel admin-form" onSubmit={save}>
      <h2>{editing ? 'Edit member' : 'Add member'}</h2>
      <div className="form-row">
        <label>Email<input type="email" required value={f.email} onChange={set('email')} disabled={editing} /></label>
        <label>Name<input value={f.name} onChange={set('name')} /></label>
      </div>
      <div className="form-row">
        <label>Plan
          <select value={f.plan} onChange={set('plan')}>
            <option value="silver">Silver · 3 hrs</option>
            <option value="gold">Gold · 6 hrs</option>
          </select>
        </label>
        <label>Status
          <select value={f.status} onChange={set('status')}>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <label>Billing day<input type="number" min={1} max={31} required value={f.billingDay} onChange={set('billingDay')} /></label>
      </div>
      <div className="form-row">
        <label>Phone<input type="tel" value={f.phone} onChange={set('phone')} /></label>
        <label>Notes<input value={f.notes} onChange={set('notes')} /></label>
      </div>
      {err && <p className="error">{err}</p>}
      <div className="row-actions">
        <button className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  )
}

function UsagePanel({ member, onChange }) {
  const { api } = useAuth()
  const usage = useApi(`/api/admin/members/${encodeURIComponent(member.id)}/usage`)
  const [f, setF] = useState({ date: todayYmd(), hours: 1, type: 'included', note: '' })
  const [err, setErr] = useState('')

  async function add(e) {
    e.preventDefault()
    setErr('')
    try {
      await api(`/api/admin/members/${encodeURIComponent(member.id)}/usage`, { method: 'POST', body: JSON.stringify(f) })
      usage.reload()
      onChange()
    } catch (e2) {
      setErr(e2.message)
    }
  }
  async function remove(id) {
    if (!confirm('Remove this entry?')) return
    await api(`/api/admin/usage/${id}`, { method: 'DELETE' })
    usage.reload()
    onChange()
  }

  return (
    <div className="panel">
      <h2>Hours · {member.name || member.email}</h2>
      {member.hours && (
        <p className="muted">
          {fmtHours(member.hours.usedHours)} of {member.hours.includedHours} used · cycle {fmtDate(member.hours.cycle.start)}–{fmtDate(member.hours.cycle.end)}
        </p>
      )}
      <form className="form-row admin-usage" onSubmit={add}>
        <label>Date<input type="date" required value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
        <label>Hours<input type="number" step="0.5" min="0.5" max="24" required value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value })} /></label>
        <label>Type
          <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
            <option value="included">Included</option>
            <option value="extra">Extra (discounted)</option>
          </select>
        </label>
        <button className="btn btn-primary">Log</button>
      </form>
      {err && <p className="error">{err}</p>}
      <ul className="visits">
        {(usage.data?.usage || []).map((u) => (
          <li key={u.id}>
            <span>{fmtDate(u.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="muted">{fmtHours(u.hours)} · {u.type}</span>
            <button className="linkish danger" onClick={() => remove(u.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Members() {
  const { api } = useAuth()
  const list = useApi('/api/admin/members')
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')

  if (list.error) return <p className="error">{list.error.message}</p>
  const members = (list.data?.members || []).filter((m) =>
    `${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase()),
  )
  const sel = members.find((m) => m.id === selected)

  async function remove(m) {
    if (!confirm(`Delete ${m.email}? Their hours log stays on file.`)) return
    await api(`/api/admin/members/${encodeURIComponent(m.id)}`, { method: 'DELETE' })
    setSelected(null)
    list.reload()
  }

  return (
    <>
      {list.data?.storage === 'file' && <p className="notice">Preview storage — data isn’t permanent until Firebase is connected.</p>}
      <div className="admin-bar">
        <input type="search" placeholder="Search members" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary" onClick={() => setEditing(blankMember)}>Add member</button>
      </div>
      {editing && (
        <MemberForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => { setEditing(null); list.reload() }}
        />
      )}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Member</th><th>Plan</th><th>Status</th><th>Hours left</th><th>Renews</th><th /></tr></thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className={m.id === selected ? 'is-selected' : ''}>
                <td><b>{m.name || '—'}</b><br /><span className="muted small">{m.email}</span></td>
                <td className="cap">{m.plan}</td>
                <td><span className={`pill pill-${m.status === 'active' ? 'ok' : 'muted'}`}>{m.status}</span></td>
                <td>{m.hours ? `${m.hours.remainingHours} / ${m.hours.includedHours}` : '—'}</td>
                <td>{m.hours ? fmtDate(m.hours.cycle.end) : '—'}</td>
                <td>
                  <div className="row-actions">
                    <button className="linkish" onClick={() => setSelected(m.id)}>Hours</button>
                    <button className="linkish" onClick={() => setEditing(m)}>Edit</button>
                    <button className="linkish danger" onClick={() => remove(m)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {!members.length && (
              <tr><td colSpan={6} className="muted">{list.loading ? '…' : 'No members yet.'}</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {sel && <UsagePanel key={sel.id} member={sel} onChange={list.reload} />}
    </>
  )
}

function Waivers() {
  const [q, setQ] = useState('')
  const [term, setTerm] = useState('')
  const list = useApi(`/api/admin/waivers?q=${encodeURIComponent(term)}`, [term])
  return (
    <>
      <form className="admin-bar" onSubmit={(e) => { e.preventDefault(); setTerm(q) }}>
        <input type="search" placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary">Search</button>
      </form>
      {list.error && <p className="error">{list.error.message}</p>}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Signed</th><th>Name</th><th>Birthday</th><th>Phone</th><th>Email</th><th>Minors</th></tr></thead>
          <tbody>
            {(list.data?.waivers || []).map((w) => (
              <tr key={w.id}>
                <td>{new Date(w.signedAt).toLocaleString()}</td>
                <td>{w.firstName} {w.lastName}</td>
                <td>{w.birthday}</td>
                <td>{w.phone}</td>
                <td>{w.email}</td>
                <td className="pre">{w.minors}</td>
              </tr>
            ))}
            {list.data && !list.data.waivers.length && <tr><td colSpan={6} className="muted">No waivers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default function Admin() {
  const { user } = useAuth()
  const location = useLocation()
  const me = useApi('/api/me')
  const [tab, setTab] = useState('members')

  if (user === undefined) return <div className="portal-loading" />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (me.data && !me.data.isAdmin) return <section className="section container"><p className="error">Admins only.</p></section>

  return (
    <div className="portal">
      <div className="portal-bar">
        <div className="container portal-bar-inner">
          <nav className="tabs">
            <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>Members</button>
            <button className={tab === 'waivers' ? 'active' : ''} onClick={() => setTab('waivers')}>Waivers</button>
          </nav>
        </div>
      </div>
      <div className="container portal-body">
        <header className="portal-head"><h1>Admin</h1></header>
        {me.data && (tab === 'members' ? <Members /> : <Waivers />)}
      </div>
    </div>
  )
}
