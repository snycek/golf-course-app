import { useMemo, useState } from 'react'
import { useAuth, useApi } from '../lib/auth.jsx'
import HBarChart from '../components/charts/HBarChart.jsx'
import { fmtDate, todayYmd } from '../lib/format.js'

const money = (cents) =>
  (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'USD' })

function periodRange(key) {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const y = now.getFullYear()
  const m = now.getMonth()
  if (key === 'month') return { from: ymd(new Date(y, m, 1)), to: ymd(new Date(y, m + 1, 0)) }
  if (key === 'last') return { from: ymd(new Date(y, m - 1, 1)), to: ymd(new Date(y, m, 0)) }
  if (key === 'year') return { from: `${y}-01-01`, to: `${y}-12-31` }
  return { from: '', to: '' }
}

const PERIODS = [
  { key: 'month', label: 'This month' },
  { key: 'last', label: 'Last month' },
  { key: 'year', label: 'This year' },
  { key: 'all', label: 'All' },
]

function csvCell(v) {
  const s = String(v ?? '')
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function exportCsv(entries, label) {
  const rows = [['Date', 'Type', 'Category', 'Vendor / source', 'Method', 'Amount', 'Note']]
  for (const e of [...entries].reverse()) {
    rows.push([e.date, e.type, e.category, e.vendor, e.method, (e.type === 'expense' ? -1 : 1) * (e.amountCents / 100), e.note])
  }
  const blob = new Blob([rows.map((r) => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `teeinitup-books-${label.toLowerCase().replace(/\s+/g, '-')}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}

function EntryForm({ categories, methods, onSaved }) {
  const { api } = useAuth()
  const blank = (type) => ({ type, date: todayYmd(), amount: '', category: '', vendor: '', method: '', note: '' })
  const [f, setF] = useState(blank('expense'))
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const cats = categories?.[f.type] || []

  async function save(e) {
    e.preventDefault()
    setErr('')
    setBusy(true)
    try {
      await api('/api/admin/ledger', { method: 'POST', body: JSON.stringify(f) })
      setF({ ...blank(f.type), date: f.date })
      onSaved()
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel entry-form" onSubmit={save}>
      <div className="seg seg-wide" role="tablist">
        {['expense', 'income'].map((t) => (
          <button key={t} type="button" role="tab" aria-selected={f.type === t}
            className={f.type === t ? 'on' : ''} onClick={() => setF({ ...f, type: t, category: '' })}>
            {t === 'expense' ? 'Expense' : 'Income'}
          </button>
        ))}
      </div>
      <div className="form-row">
        <label>Amount
          <span className="money-input"><span>$</span><input inputMode="decimal" required placeholder="0.00" value={f.amount} onChange={set('amount')} /></span>
        </label>
        <label>Date<input type="date" required value={f.date} onChange={set('date')} /></label>
      </div>
      <div className="form-row">
        <label>Category
          <select required value={f.category} onChange={set('category')}>
            <option value="">Choose…</option>
            {cats.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>Paid by
          <select value={f.method} onChange={set('method')}>
            <option value="">—</option>
            {(methods || []).map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>{f.type === 'expense' ? 'Vendor' : 'Source'}<input value={f.vendor} onChange={set('vendor')} placeholder={f.type === 'expense' ? 'e.g. DTE Energy' : 'e.g. TrackMan payout'} /></label>
        <label>Note<input value={f.note} onChange={set('note')} placeholder="Optional" /></label>
      </div>
      {err && <p className="error">{err}</p>}
      <button className="btn btn-primary btn-block" disabled={busy}>Add {f.type}</button>
    </form>
  )
}

export default function Books() {
  const { api } = useAuth()
  const [period, setPeriod] = useState('month')
  const range = periodRange(period)
  const q = `/api/admin/ledger?from=${range.from}&to=${range.to}`
  const ledger = useApi(q, [q])
  const entries = ledger.data?.entries || []

  const totals = useMemo(() => {
    const t = { income: 0, expense: 0, byCat: {} }
    for (const e of entries) {
      t[e.type] += e.amountCents
      if (e.type === 'expense') t.byCat[e.category] = (t.byCat[e.category] || 0) + e.amountCents
    }
    return t
  }, [entries])
  const byCat = Object.entries(totals.byCat).map(([cat, cents]) => ({ cat, cents })).sort((a, b) => b.cents - a.cents)
  const net = totals.income - totals.expense
  const label = PERIODS.find((p) => p.key === period).label

  async function remove(id) {
    if (!confirm('Delete this entry?')) return
    await api(`/api/admin/ledger/${id}`, { method: 'DELETE' })
    ledger.reload()
  }

  return (
    <div className="books">
      <div className="books-bar">
        <div className="seg" role="tablist" aria-label="Period">
          {PERIODS.map((p) => (
            <button key={p.key} role="tab" aria-selected={period === p.key} className={period === p.key ? 'on' : ''} onClick={() => setPeriod(p.key)}>
              {p.label}
            </button>
          ))}
        </div>
        <button className="btn btn-outline btn-sm" disabled={!entries.length} onClick={() => exportCsv(entries, label)}>Export CSV</button>
      </div>


      <div className="tiles tiles-3">
        <div className="tile"><span className="tile-label">Income</span><strong className="tile-value">{money(totals.income)}</strong></div>
        <div className="tile"><span className="tile-label">Expenses</span><strong className="tile-value">{money(totals.expense)}</strong></div>
        <div className="tile">
          <span className="tile-label">Net</span>
          <strong className={`tile-value ${net < 0 ? 'neg' : ''}`}>{net < 0 ? '−' : ''}{money(Math.abs(net))}</strong>
        </div>
      </div>

      <div className="books-grid">
        <EntryForm categories={ledger.data?.categories} methods={ledger.data?.methods} onSaved={ledger.reload} />

        <div className="panel books-list">
          <div className="panel-head"><h2>Entries</h2><span className="muted small">{entries.length}</span></div>
          {byCat.length > 0 && (
            <div className="books-cats">
              <HBarChart ariaLabel="Expenses by category" data={byCat.slice(0, 4)} label={(d) => d.cat} value={(d) => d.cents} format={money} />
            </div>
          )}
          <div className="table-wrap flat books-table">
            <table className="table">
              <colgroup><col style={{ width: '4.5rem' }} /><col /><col style={{ width: '7.5rem' }} /><col style={{ width: '2.5rem' }} /></colgroup>
              <thead><tr><th>Date</th><th>Entry</th><th className="num">Amount</th><th /></tr></thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id}>
                    <td>{fmtDate(e.date)}</td>
                    <td className="entry-cell">
                      <span>{e.category}</span>
                      <span className="muted small">{[e.vendor, e.method, e.note].filter(Boolean).join(' · ') || '—'}</span>
                    </td>
                    <td className={`num ${e.type === 'income' ? 'pos' : ''}`}>{e.type === 'income' ? '+' : '−'}{money(e.amountCents)}</td>
                    <td><button className="icon-btn" onClick={() => remove(e.id)} aria-label={`Delete ${e.category} entry`} title="Delete">×</button></td>
                  </tr>
                ))}
                {!entries.length && <tr><td colSpan={4} className="muted">{ledger.loading ? '…' : `Nothing recorded for ${label.toLowerCase()}.`}</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
