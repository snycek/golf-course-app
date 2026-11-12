import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

// Login state for the member portal. Uses Firebase Auth when the server
// provides a Firebase web config; otherwise, in preview ("dev") mode, signs in
// by email alone so the portal can be reviewed before Firebase is set up.
const AuthContext = createContext(null)
const DEV_KEY = 'tiu-dev-email'

function safeStorage(fn, fallback = null) {
  try {
    return fn()
  } catch {
    return fallback
  }
}

export function AuthProvider({ children }) {
  const [mode, setMode] = useState(null) // 'firebase' | 'dev' | 'none'
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out
  const fb = useRef(null)

  useEffect(() => {
    let unsub = () => {}
    ;(async () => {
      const cfg = await fetch('/api/config').then((r) => r.json()).catch(() => ({ authMode: 'none' }))
      if (cfg.authMode === 'firebase' && cfg.firebase) {
        const { initializeApp } = await import('firebase/app')
        const authMod = await import('firebase/auth')
        const auth = authMod.getAuth(initializeApp(cfg.firebase))
        fb.current = { auth, ...authMod }
        setMode('firebase')
        unsub = authMod.onAuthStateChanged(auth, (u) => setUser(u ? { email: u.email } : null))
      } else if (cfg.authMode === 'dev') {
        setMode('dev')
        const email = safeStorage(() => localStorage.getItem(DEV_KEY))
        setUser(email ? { email } : null)
      } else {
        setMode('none')
        setUser(null)
      }
    })()
    return () => unsub()
  }, [])

  const getToken = useCallback(async () => {
    if (mode === 'firebase') return fb.current?.auth.currentUser?.getIdToken()
    if (mode === 'dev' && user) return `dev:${user.email}`
    return null
  }, [mode, user])

  const signIn = useCallback(async (email, password) => {
    if (mode === 'firebase') {
      await fb.current.signInWithEmailAndPassword(fb.current.auth, email, password)
    } else if (mode === 'dev') {
      const clean = email.trim().toLowerCase()
      safeStorage(() => localStorage.setItem(DEV_KEY, clean))
      setUser({ email: clean })
    } else {
      throw new Error('Member login isn’t available yet.')
    }
  }, [mode])

  const signUp = useCallback(async (email, password) => {
    if (mode === 'firebase') {
      await fb.current.createUserWithEmailAndPassword(fb.current.auth, email, password)
    } else {
      await signIn(email, password)
    }
  }, [mode, signIn])

  const resetPassword = useCallback(async (email) => {
    if (mode !== 'firebase') throw new Error('Password reset isn’t available in preview mode.')
    await fb.current.sendPasswordResetEmail(fb.current.auth, email)
  }, [mode])

  const signOut = useCallback(async () => {
    if (mode === 'firebase') await fb.current.signOut(fb.current.auth)
    safeStorage(() => localStorage.removeItem(DEV_KEY))
    setUser(null)
  }, [mode])

  // fetch() wrapper that adds the bearer token and unwraps JSON errors.
  const api = useCallback(async (path, opts = {}) => {
    const token = await getToken()
    const res = await fetch(path, {
      ...opts,
      headers: {
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...opts.headers,
      },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status })
    return data
  }, [getToken])

  return (
    <AuthContext.Provider value={{ mode, user, signIn, signUp, signOut, resetPassword, api }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

// Small data-loading hook bound to the authenticated api().
export function useApi(path, deps = []) {
  const { api, user } = useAuth()
  const [state, setState] = useState({ data: null, error: null, loading: true })
  const reload = useCallback(() => {
    if (!user) return
    setState((s) => ({ ...s, loading: true }))
    api(path)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState({ data: null, error, loading: false }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, user, path, ...deps])
  useEffect(() => {
    reload()
  }, [reload])
  return { ...state, reload }
}

export function friendlyAuthError(err) {
  const code = err?.code || ''
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'That email and password don’t match.'
  if (code.includes('email-already-in-use')) return 'An account already exists for that email. Try signing in.'
  if (code.includes('weak-password')) return 'Use a password with at least 6 characters.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a minute and try again.'
  return err?.message || 'Something went wrong.'
}
