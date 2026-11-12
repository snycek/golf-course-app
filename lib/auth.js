// Request authentication. Production uses Firebase Auth ID tokens. When
// Firebase isn't configured and DEV_AUTH=1, a "dev:<email>" token is accepted
// so the portal can be previewed without a Firebase project. Never set
// DEV_AUTH in production.
import { firebaseAdmin } from './firebase.js'

export const devAuthEnabled = () => process.env.DEV_AUTH === '1'

export async function authMode() {
  if (await firebaseAdmin()) return 'firebase'
  return devAuthEnabled() ? 'dev' : 'none'
}

export function adminEmails() {
  return (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
}

async function userFromToken(token) {
  if (!token) return null
  const fb = await firebaseAdmin()
  if (fb) {
    const decoded = await fb.auth.verifyIdToken(token)
    if (!decoded.email) return null
    return { uid: decoded.uid, email: decoded.email.toLowerCase() }
  }
  if (devAuthEnabled() && token.startsWith('dev:')) {
    const email = token.slice(4).trim().toLowerCase()
    return email ? { uid: `dev-${email}`, email } : null
  }
  return null
}

export async function requireUser(req, res, next) {
  try {
    const header = req.get('authorization') || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    const user = await userFromToken(token)
    if (!user) return res.status(401).json({ error: 'Please sign in.' })
    user.isAdmin = adminEmails().includes(user.email)
    req.user = user
    next()
  } catch {
    res.status(401).json({ error: 'Your session expired. Please sign in again.' })
  }
}

export function requireAdmin(req, res, next) {
  requireUser(req, res, () => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admins only.' })
    next()
  })
}
