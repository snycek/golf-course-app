import express from 'express'
import path from 'path'
import crypto from 'crypto'
import { fileURLToPath } from 'url'
import { saveWaiver, listWaivers, storageMode } from './lib/waiverStore.js'

try {
  const { config } = await import('dotenv')
  config()
} catch {}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, 'dist')
const app = express()
app.set('trust proxy', true)
app.use(express.json({ limit: '20kb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Basic per-IP limit so the public waiver form can't be flooded.
const hits = new Map()
function rateLimit(req, res, next) {
  const now = Date.now()
  const key = req.ip
  const recent = (hits.get(key) || []).filter((t) => now - t < 10 * 60 * 1000)
  if (recent.length >= 20) return res.status(429).json({ error: 'Too many submissions. Please try again later.' })
  recent.push(now)
  hits.set(key, recent)
  next()
}

const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

app.post('/api/waivers', rateLimit, async (req, res) => {
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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.birthday)) return res.status(400).json({ error: 'Please enter a valid birthday.' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(record.email)) return res.status(400).json({ error: 'Please enter a valid email.' })
  if (!record.agreed) return res.status(400).json({ error: 'You must agree to the waiver to continue.' })

  try {
    const saved = await saveWaiver({
      ...record,
      signedAt: new Date().toISOString(),
      ip: req.ip,
      userAgent: str(req.get('user-agent'), 300),
    })
    res.status(201).json({ ok: true, id: saved.id })
  } catch (err) {
    console.error('waiver save failed', err)
    res.status(500).json({ error: 'We couldn’t save your waiver. Please try again or call us.' })
  }
})

// Owner lookup. Requires ADMIN_PASSWORD; disabled entirely when it's unset.
function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return res.status(503).json({ error: 'Admin access is not configured.' })
  const given = req.get('x-admin-password') || ''
  const a = Buffer.from(given)
  const e = Buffer.from(expected)
  if (a.length !== e.length || !crypto.timingSafeEqual(a, e)) return res.status(401).json({ error: 'Wrong password.' })
  next()
}

app.get('/api/admin/waivers', rateLimit, requireAdmin, async (req, res) => {
  try {
    const rows = await listWaivers({ q: str(req.query.q, 100) })
    res.json({ storage: await storageMode(), waivers: rows })
  } catch (err) {
    console.error('waiver list failed', err)
    res.status(500).json({ error: 'Could not load waivers.' })
  }
})

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }))

app.use(express.static(distPath))
// SPA fallback: React Router handles every other route.
app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')))

const port = process.env.PORT || 3000
app.listen(port, async () => {
  console.log(`golf-course-app listening on :${port} (waiver storage: ${await storageMode()})`)
})
