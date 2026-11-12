import { useState } from 'react'

// Owner-only page for looking up signed waivers. Not linked from the site.
export default function Admin() {
  const [password, setPassword] = useState('')
  const [q, setQ] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function load(e) {
    e?.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/waivers?q=${encodeURIComponent(q)}`, {
        headers: { 'x-admin-password': password },
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error || 'Request failed')
      setData(body)
    } catch (err) {
      setError(err.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1>Signed waivers</h1>
        <form className="admin-bar" onSubmit={load}>
          <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="search" placeholder="Search name, email or phone" value={q} onChange={(e) => setQ(e.target.value)} />
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Loading…' : 'Search'}</button>
        </form>
        {error && <p className="error">{error}</p>}
        {data && (
          <>
            {data.storage === 'file' && (
              <p className="error">Storage isn’t connected to Firebase yet — waivers here are temporary.</p>
            )}
            <p className="muted">{data.waivers.length} result{data.waivers.length === 1 ? '' : 's'}</p>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>Signed</th><th>Name</th><th>Birthday</th><th>Phone</th><th>Email</th><th>Minors</th></tr>
                </thead>
                <tbody>
                  {data.waivers.map((w) => (
                    <tr key={w.id}>
                      <td>{new Date(w.signedAt).toLocaleString()}</td>
                      <td>{w.firstName} {w.lastName}</td>
                      <td>{w.birthday}</td>
                      <td>{w.phone}</td>
                      <td>{w.email}</td>
                      <td className="pre">{w.minors}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
