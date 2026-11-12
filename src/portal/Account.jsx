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
      <article className="panel account">
        {m ? (
          <form onSubmit={save}>
            <div className="form-row">
              <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
              <label>Phone<input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
            </div>
            <label>Email<input value={me.email} disabled /></label>
            <button className="btn btn-primary">Save</button>
            {msg && <span className="muted small save-msg">{msg}</span>}
          </form>
        ) : (
          <p className="muted">Signed in as {me.email}. <Link to="/memberships">View plans</Link></p>
        )}
        {m && (
          <p className="muted small account-meta">
            <span className="cap">{m.status}</span> since {fmtLongDate(m.startedOn)} · Billing questions:{' '}
            <a href={`mailto:${business.email}`}>{business.email}</a>
          </p>
        )}
        <details className="faq">
          <summary>Membership rules</summary>
          <ul className="checks">{memberships.guidelines.map((g) => <li key={g}>{g}</li>)}</ul>
        </details>
      </article>
    </>
  )
}
