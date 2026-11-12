// Stores signed waivers. Uses Firestore when FIREBASE_SERVICE_ACCOUNT (the
// service-account JSON) is set, the same setup as our other apps. Without it,
// falls back to a local JSON-lines file, which is fine for development but is
// wiped on every Railway deploy, so production must set Firebase.
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const COLLECTION = 'waivers'
let db = null

async function firestore() {
  if (db !== null) return db
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT
  if (!raw) return (db = false)
  const { initializeApp, cert, getApps } = await import('firebase-admin/app')
  const { getFirestore } = await import('firebase-admin/firestore')
  if (!getApps().length) initializeApp({ credential: cert(JSON.parse(raw)) })
  return (db = getFirestore())
}

const filePath = path.resolve(process.env.WAIVER_FILE || 'data/waivers.jsonl')

function readFileRecords() {
  if (!fs.existsSync(filePath)) return []
  return fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
}

export async function storageMode() {
  return (await firestore()) ? 'firestore' : 'file'
}

export async function saveWaiver(record) {
  const doc = { id: crypto.randomUUID(), ...record }
  const fdb = await firestore()
  if (fdb) {
    await fdb.collection(COLLECTION).doc(doc.id).set(doc)
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
    fs.appendFileSync(filePath, JSON.stringify(doc) + '\n')
  }
  return doc
}

export async function listWaivers({ q = '', limit = 200 } = {}) {
  const fdb = await firestore()
  let rows
  if (fdb) {
    const snap = await fdb.collection(COLLECTION).orderBy('signedAt', 'desc').limit(1000).get()
    rows = snap.docs.map((d) => d.data())
  } else {
    rows = readFileRecords().sort((a, b) => b.signedAt.localeCompare(a.signedAt))
  }
  const needle = q.trim().toLowerCase()
  if (needle) {
    rows = rows.filter((r) =>
      [r.firstName, r.lastName, `${r.firstName} ${r.lastName}`, r.email, r.phone, r.minors]
        .some((v) => (v || '').toLowerCase().includes(needle)),
    )
  }
  return rows.slice(0, limit)
}
