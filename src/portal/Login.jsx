import { useState } from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth, friendlyAuthError } from '../lib/auth.jsx'

export default function Login() {
  const { mode, user, signIn, signUp, resetPassword } = useAuth()
  const { state } = useLocation()
  const [tab, setTab] = useState('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={state?.from || '/portal'} replace />
  const preview = mode === 'dev'

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setMsg({})
    try {
      await (tab === 'in' ? signIn : signUp)(email, password)
    } catch (err) {
      setMsg({ type: 'error', text: friendlyAuthError(err) })
    } finally {
      setBusy(false)
    }
  }

  async function forgot() {
    if (!email) return setMsg({ type: 'error', text: 'Enter your email first.' })
    try {
      await resetPassword(email)
      setMsg({ type: 'ok', text: 'Check your email for a reset link.' })
    } catch (err) {
      setMsg({ type: 'error', text: friendlyAuthError(err) })
    }
  }

  return (
    <section className="auth">
      <div className="auth-card">
        <p className="eyebrow">Members</p>
        <h1>{tab === 'in' ? 'Welcome back' : 'Create account'}</h1>
        {mode === 'none' ? (
          <p className="muted">Member login is coming soon.</p>
        ) : (
          <form onSubmit={submit}>
            {preview && (
              <p className="notice">Preview mode — sign in with any email. Try <b>demo@teeinitup.net</b>.</p>
            )}
            <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></label>
            {!preview && (
              <label>Password
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  autoComplete={tab === 'in' ? 'current-password' : 'new-password'} />
              </label>
            )}
            {msg.text && <p className={msg.type === 'error' ? 'error' : 'ok'} role="status">{msg.text}</p>}
            <button className="btn btn-primary btn-block" disabled={busy}>{busy ? '…' : tab === 'in' ? 'Sign in' : 'Create account'}</button>
            <div className="auth-links">
              {tab === 'in' ? (
                <>
                  <button type="button" className="linkish" onClick={() => setTab('up')}>New member? Create account</button>
                  {!preview && <button type="button" className="linkish" onClick={forgot}>Forgot password</button>}
                </>
              ) : (
                <button type="button" className="linkish" onClick={() => setTab('in')}>Have an account? Sign in</button>
              )}
            </div>
          </form>
        )}
        <p className="muted small auth-foot">Not a member? <Link to="/memberships">See plans</Link></p>
      </div>
    </section>
  )
}
