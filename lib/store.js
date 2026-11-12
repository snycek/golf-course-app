// Tiny document store: Firestore in production, JSON files in data/ for local
// development and previews. Railway's disk is wiped on deploy, so production
// must set FIREBASE_SERVICE_ACCOUNT.
import fs from 'fs'
import path from 'path'
import { firebaseAdmin } from './firebase.js'

const dataDir = path.resolve(process.env.DATA_DIR || 'data')

function fileFor(col) {
  return path.join(dataDir, `${col}.json`)
}
function readCol(col) {
  try {
    return JSON.parse(fs.readFileSync(fileFor(col), 'utf8'))
  } catch {
    return {}
  }
}
function writeCol(col, docs) {
  fs.mkdirSync(dataDir, { recursive: true })
  const tmp = fileFor(col) + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(docs, null, 2))
  fs.renameSync(tmp, fileFor(col))
}

export async function storageMode() {
  return (await firebaseAdmin()) ? 'firestore' : 'file'
}

export async function getDoc(col, id) {
  const fb = await firebaseAdmin()
  if (fb) {
    const snap = await fb.db.collection(col).doc(id).get()
    return snap.exists ? snap.data() : null
  }
  return readCol(col)[id] || null
}

export async function setDoc(col, id, doc) {
  const fb = await firebaseAdmin()
  const value = { ...doc, id }
  if (fb) {
    await fb.db.collection(col).doc(id).set(value)
  } else {
    const docs = readCol(col)
    docs[id] = value
    writeCol(col, docs)
  }
  return value
}

export async function deleteDoc(col, id) {
  const fb = await firebaseAdmin()
  if (fb) return fb.db.collection(col).doc(id).delete()
  const docs = readCol(col)
  delete docs[id]
  writeCol(col, docs)
}

// where: optional [field, value] equality filter.
export async function listDocs(col, where) {
  const fb = await firebaseAdmin()
  if (fb) {
    let q = fb.db.collection(col)
    if (where) q = q.where(where[0], '==', where[1])
    const snap = await q.get()
    return snap.docs.map((d) => d.data())
  }
  const all = Object.values(readCol(col))
  return where ? all.filter((d) => d[where[0]] === where[1]) : all
}
