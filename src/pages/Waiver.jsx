import { useState } from 'react'
import { waiverIntro } from '../content.js'
import { waiverTitle, waiverAddress, waiverSections, WAIVER_VERSION } from '../waiverText.js'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const thisYear = new Date().getFullYear()
const YEARS = Array.from({ length: 100 }, (_, i) => thisYear - i)
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

const empty = { firstName: '', lastName: '', month: '', day: '', year: '', phone: '', email: '', minors: '', agreed: false }

function Block({ block }) {
  if (typeof block === 'string') return <p>{block}</p>
  if (block.caps) return <p className="caps">{block.caps}</p>
  return <ul>{block.list.map((li) => <li key={li}>{li}</li>)}</ul>
}

export default function Waiver() {
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState({ state: 'idle', message: '' })

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setStatus({ state: 'sending', message: '' })
    try {
      const res = await fetch('/api/waivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          birthday: form.year && form.month && form.day
            ? `${form.year}-${String(form.month).padStart(2, '0')}-${String(form.day).padStart(2, '0')}`
            : '',
          phone: form.phone,
          email: form.email,
          minors: form.minors,
          agreed: form.agreed,
          waiverVersion: WAIVER_VERSION,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus({ state: 'done', message: '' })
      setForm(empty)
    } catch (err) {
      setStatus({ state: 'error', message: err.message })
    }
  }

  return (
    <section className="page fill">
      <div className="container waiver-layout">
        <div className="waiver-left">
          <h1>Waiver</h1>
          <p className="muted">Required for every golfer. Valid 12 months.</p>
          <article className="waiver-doc scroll-panel">
            <h2>{waiverTitle}</h2>
            <p className="muted">{waiverAddress.join(' · ')}</p>
            {waiverSections.map((s) => (
              <section key={s.heading}>
                <h3>{s.heading}</h3>
                {s.blocks.map((b, i) => <Block key={i} block={b} />)}
              </section>
            ))}
          </article>
        </div>

        <div id="waiver-form" className="panel waiver-form">
          {status.state === 'done' ? (
            <div className="success" role="status">
              <h3>Signed. Thank you.</h3>
              <p className="muted">Valid for 12 months. Each guest signs their own.</p>
              <button className="btn btn-outline" onClick={() => setStatus({ state: 'idle', message: '' })}>
                Sign for another guest
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h3>Sign</h3>
              <div className="form-row">
                <label>First name*<input required value={form.firstName} onChange={set('firstName')} autoComplete="given-name" /></label>
                <label>Last name*<input required value={form.lastName} onChange={set('lastName')} autoComplete="family-name" /></label>
              </div>
              <fieldset className="form-row form-row-3">
                <legend>Birthday*</legend>
                <label className="sr-label">Month
                  <select required value={form.month} onChange={set('month')}>
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </label>
                <label className="sr-label">Day
                  <select required value={form.day} onChange={set('day')}>
                    <option value="">Day</option>
                    {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label className="sr-label">Year
                  <select required value={form.year} onChange={set('year')}>
                    <option value="">Year</option>
                    {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </label>
              </fieldset>
              <div className="form-row">
                <label>Phone*<input required type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>
                <label>Email*<input required type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
              </div>
              <label>Minors (name &amp; date of birth)
                <textarea rows={2} value={form.minors} onChange={set('minors')} placeholder="Optional — one per line" />
              </label>
              <label className="check">
                <input type="checkbox" required checked={form.agreed} onChange={set('agreed')} />
                <span>I agree to the release of liability waiver.*</span>
              </label>
              {status.state === 'error' && <p className="error" role="alert">{status.message}</p>}
              <button className="btn btn-primary btn-block" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Submitting…' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
