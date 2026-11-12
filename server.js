import express from 'express'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { getDoc, setDoc, deleteDoc, listDocs, storageMode } from './lib/store.js'
import { requireUser, requireAdmin, authMode, adminEmails } from './lib/auth.js'
import { PLANS, hoursSummary, publicMember } from './lib/membership.js'
import { memberStats } from './lib/stats.js'
import { parseEntry, EXPENSE_CATEGORIES, INCOME_CATEGORIES, METHODS } from './lib/ledger.js'

try {
  const { config } = await import('dotenv')
  config()
} catch {}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')
const app = express()
app.set('trust proxy', true)
app.use(express.json({ limit: '20kb' }))

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const isDate = (v) => /^\d{4}-\d{2}-\d{2}$/.test(v)
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
const WAIVER_VALID_DAYS = 365

// Basic per-IP limiter for public endpoints.
function rateLimit(max, windowMs) {
  const hits = new Map()
  return (req, res, next) => {
    const now = Date.now()
    const recent = (hits.get(req.ip) || []).filter((t) => now - t < windowMs)
    if (recent.length >= max) return res.status(429).json({ error: 'Too many requests. Please try again later.' })
    recent.push(now)
    hits.set(req.ip, recent)
    next()
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Public client config: which login mode to use and Firebase's web config.
app.get('/api/config', wrap(async (_req, res) => {
  let firebase = null
  try {
    firebase = process.env.FIREBASE_WEB_CONFIG ? JSON.parse(process.env.FIREBASE_WEB_CONFIG) : null
  } catch {
    console.error('FIREBASE_WEB_CONFIG is not valid JSON')
  }
  res.json({ authMode: await authMode(), firebase })
}))

// ---------- Waivers ----------

async function latestWaiver(email) {
  const rows = await listDocs('waivers', ['email', email])
  rows.sort((a, b) => b.signedAt.localeCompare(a.signedAt))
  const w = rows[0]
  if (!w) return null
  const expires = new Date(w.signedAt)
  expires.setDate(expires.getDate() + WAIVER_VALID_DAYS)
  return { signedAt: w.signedAt, expiresAt: expires.toISOString(), valid: expires > new Date() }
}

app.post('/api/waivers', rateLimit(20, 10 * 60 * 1000), wrap(async (req, res) => {
  const b = req.body || {}
  const record = {
    firstName: str(b.firstName, 80),
    lastName: str(b.lastName, 80),
    birthday: str(b.birthday, 10),
    phone: str(b.phone, 40),
    email: str(b.email, 200).toLowerCase(),
    minors: str(b.minors, 1000),
    agreed: b.agreed === true,
    waiverVersion: str(b.waiverVersion, 20),
  }
  const missing = ['firstName', 'lastName', 'birthday', 'phone', 'email'].filter((k) => !record[k])
  if (missing.length) return res.status(400).json({ error: 'Please fill in all required fields.' })
  if (!isDate(record.birthday)) return res.status(400).json({ error: 'Please enter a valid birthday.' })
  if (!isEmail(record.email)) return res.status(400).json({ error: 'Please enter a valid email.' })
  if (!record.agreed) return res.status(400).json({ error: 'You must agree to the waiver to continue.' })

  const id = crypto.randomUUID()
  await setDoc('waivers', id, {
    ...record,
    signedAt: new Date().toISOString(),
    ip: req.ip,
    userAgent: str(req.get('user-agent'), 300),
  })
  res.status(201).json({ ok: true, id })
}))

// ---------- Member portal ----------

async function memberUsage(email) {
  const rows = await listDocs('usage', ['memberId', email])
  return rows.sort((a, b) => b.date.localeCompare(a.date))
}

app.get('/api/me', requireUser, wrap(async (req, res) => {
  const member = await getDoc('members', req.user.email)
  const usage = member ? await memberUsage(member.id) : []
  res.json({
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    member: publicMember(member),
    hours: member && member.status === 'active' ? hoursSummary(member, usage) : null,
    waiver: await latestWaiver(req.user.email),
  })
}))

app.get('/api/me/usage', requireUser, wrap(async (req, res) => {
  const member = await getDoc('members', req.user.email)
  if (!member) return res.json({ usage: [] })
  res.json({ usage: (await memberUsage(member.id)).slice(0, 100) })
}))

app.get('/api/me/stats', requireUser, wrap(async (req, res) => {
  const member = await getDoc('members', req.user.email)
  if (!member) return res.status(404).json({ error: 'No membership found for this account.' })
  const stored = await listDocs('sessions', ['memberId', member.id])
  res.json(await memberStats(member, stored))
}))

app.patch('/api/me', requireUser, wrap(async (req, res) => {
  const member = await getDoc('members', req.user.email)
  if (!member) return res.status(404).json({ error: 'No membership found for this account.' })
  const updated = await setDoc('members', member.id, {
    ...member,
    name: str(req.body?.name, 120) || member.name,
    phone: str(req.body?.phone, 40),
    updatedAt: new Date().toISOString(),
  })
  res.json({ member: publicMember(updated) })
}))

// ---------- Admin ----------

app.get('/api/admin/members', requireAdmin, wrap(async (_req, res) => {
  const [members, usage] = await Promise.all([listDocs('members'), listDocs('usage')])
  const rows = members
    .map((m) => ({
      ...m,
      hours: m.status === 'active' ? hoursSummary(m, usage.filter((u) => u.memberId === m.id)) : null,
    }))
    .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
  res.json({ members: rows, plans: PLANS, storage: await storageMode() })
}))

app.post('/api/admin/members', requireAdmin, wrap(async (req, res) => {
  const b = req.body || {}
  const email = str(b.email, 200).toLowerCase()
  if (!isEmail(email)) return res.status(400).json({ error: 'Enter a valid email.' })
  if (!PLANS[b.plan]) return res.status(400).json({ error: 'Choose a plan.' })
  const billingDay = Number(b.billingDay)
  if (!(billingDay >= 1 && billingDay <= 31)) return res.status(400).json({ error: 'Billing day must be 1–31.' })
  const existing = await getDoc('members', email)
  const now = new Date().toISOString()
  const member = await setDoc('members', email, {
    ...(existing || {}),
    email,
    name: str(b.name, 120),
    phone: str(b.phone, 40),
    plan: b.plan,
    status: ['active', 'paused', 'cancelled'].includes(b.status) ? b.status : 'active',
    billingDay,
    startedOn: isDate(b.startedOn) ? b.startedOn : existing?.startedOn || now.slice(0, 10),
    notes: str(b.notes, 1000),
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  })
  res.status(existing ? 200 : 201).json({ member })
}))

app.delete('/api/admin/members/:id', requireAdmin, wrap(async (req, res) => {
  await deleteDoc('members', req.params.id)
  res.json({ ok: true })
}))

app.get('/api/admin/members/:id/usage', requireAdmin, wrap(async (req, res) => {
  res.json({ usage: await memberUsage(req.params.id) })
}))

app.post('/api/admin/members/:id/usage', requireAdmin, wrap(async (req, res) => {
  const member = await getDoc('members', req.params.id)
  if (!member) return res.status(404).json({ error: 'Member not found.' })
  const b = req.body || {}
  const hours = Number(b.hours)
  if (!isDate(b.date)) return res.status(400).json({ error: 'Pick a date.' })
  if (!(hours > 0 && hours <= 24)) return res.status(400).json({ error: 'Hours must be between 0 and 24.' })
  const type = b.type === 'extra' ? 'extra' : 'included'
  const id = crypto.randomUUID()
  const entry = await setDoc('usage', id, {
    memberId: member.id,
    date: b.date,
    hours,
    type,
    note: str(b.note, 300),
    createdAt: new Date().toISOString(),
    createdBy: req.user.email,
  })
  res.status(201).json({ entry })
}))

app.delete('/api/admin/usage/:id', requireAdmin, wrap(async (req, res) => {
  await deleteDoc('usage', req.params.id)
  res.json({ ok: true })
}))

app.get('/api/admin/waivers', requireAdmin, wrap(async (req, res) => {
  const needle = str(req.query.q, 100).toLowerCase()
  let rows = (await listDocs('waivers')).sort((a, b) => b.signedAt.localeCompare(a.signedAt))
  if (needle) {
    rows = rows.filter((r) =>
      [`${r.firstName} ${r.lastName}`, r.email, r.phone, r.minors].some((v) => (v || '').toLowerCase().includes(needle)),
    )
  }
  res.json({ waivers: rows.slice(0, 200), storage: await storageMode() })
}))

// ---------- Bookkeeping ----------

app.get('/api/admin/ledger', requireAdmin, wrap(async (req, res) => {
  const from = isDate(req.query.from) ? req.query.from : '0000-00-00'
  const to = isDate(req.query.to) ? req.query.to : '9999-12-31'
  const entries = (await listDocs('ledger'))
    .filter((e) => e.date >= from && e.date <= to)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
  res.json({
    entries,
    categories: { expense: EXPENSE_CATEGORIES, income: INCOME_CATEGORIES },
    methods: METHODS,
    storage: await storageMode(),
  })
}))

app.post('/api/admin/ledger', requireAdmin, wrap(async (req, res) => {
  const { entry, error } = parseEntry(req.body)
  if (error) return res.status(400).json({ error })
  const id = crypto.randomUUID()
  const saved = await setDoc('ledger', id, { ...entry, createdAt: new Date().toISOString(), createdBy: req.user.email })
  res.status(201).json({ entry: saved })
}))

app.delete('/api/admin/ledger/:id', requireAdmin, wrap(async (req, res) => {
  await deleteDoc('ledger', req.params.id)
  res.json({ ok: true })
}))

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Something went wrong. Please try again.' })
})

app.use(express.static(distPath))
// SPA fallback: React Router handles every other route.
app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')))

// Preview mode only: seed a demo member so the portal has something to show.
async function seedDemo() {
  if ((await authMode()) !== 'dev') return
  const email = 'demo@teeinitup.net'
  if (await getDoc('members', email)) return
  const today = new Date()
  const iso = (d) => d.toISOString().slice(0, 10)
  const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d) }
  await setDoc('members', email, {
    email, name: 'Demo Member', phone: '', plan: 'gold', status: 'active',
    billingDay: Number(daysAgo(9).slice(8, 10)), startedOn: daysAgo(130), notes: 'Preview demo account',
    createdAt: today.toISOString(), updatedAt: today.toISOString(),
  })
  for (const [n, hours, type] of [[2, 2, 'included'], [6, 1, 'included'], [7, 1, 'extra']]) {
    await setDoc('usage', crypto.randomUUID(), {
      memberId: email, date: daysAgo(n), hours, type, note: '', createdAt: today.toISOString(), createdBy: 'seed',
    })
  }
  console.log(`Seeded preview member ${email}`)
}

const port = process.env.PORT || 3000
app.listen(port, async () => {
  await seedDemo()
  console.log(
    `golf-course-app listening on :${port} (auth: ${await authMode()}, storage: ${await storageMode()}, admins: ${adminEmails().join(', ') || 'none'})`,
  )
})
