// Firebase Admin, initialised once from FIREBASE_SERVICE_ACCOUNT (the
// service-account JSON). Returns null when it isn't configured.
let cached
export async function firebaseAdmin() {
  if (cached !== undefined) return cached
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) return (cached = null)
  const { initializeApp, cert, getApps } = await import('firebase-admin/app')
  const { getFirestore } = await import('firebase-admin/firestore')
  const { getAuth } = await import('firebase-admin/auth')
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(raw)) })
  return (cached = { db: getFirestore(), auth: getAuth() })
}
