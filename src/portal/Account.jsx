import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { memberships, business } from '../content.js'
import { fmtLongDate } from '../lib/format.js'

export default function Account() {
  const { data: me, reload } = useOutletContext()
  const { api } = useAuth()
  const m = me.member
  const [form, setForm] = useState({ name: m?.name || '', phone: m?.phone || '' })
  const [msg, setMsg] = useState('')

  async function save(e) {
    e.preventDefault()
    try {
      await api('/api/me', { method: 'PATCH', body: JSON.stringify(form) })
      setMsg('Saved')
      reload()
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <>
      <header className="portal-head"><h1>Account</h1></header>
      <div className="dash-grid">
        <article className="panel">
          <h2>Profile</h2>
          {m ? (
            <form onSubmit={save}>
              <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
              <label>Email<input value={me.email} disabled /></label>
              <button className="btn btn-primary">Save</button>
              {msg && <span className="muted small save-msg">{msg}</span>}
            </form>
          ) : (
            <p className="muted">Signed in as {me.email}</p>
          )}
        </article>
        <article className="panel">
          <h2>Membership</h2>
          {m ? (
            <dl className="facts facts-stack">
              <div><dt>Plan</dt><dd>{me.hours?.plan.name || m.plan}</dd></div>
              <div><dt>Status</dt><dd className="cap">{m.status}</dd></div>
              <div><dt>Member since</dt><dd>{fmtLongDate(m.startedOn)}</dd></div>
              <div><dt>Waiver</dt><dd>{me.waiver?.valid ? 'On file' : <Link to="/waiver">Sign now</Link>}</dd></div>
            </dl>
          ) : (
            <Link to="/memberships" className="btn btn-primary">View plans</Link>
          )}
          <details className="faq">
            <summary>Membership rules</summary>
            <ul className="checks">{memberships.guidelines.map((g) => <li key={g}>{g}</li>)}</ul>
          </details>
          <p className="muted small">Billing changes: <a href={`mailto:${business.email}`}>{business.email}</a></p>
        </article>
      </div>
    </>
  )
}
