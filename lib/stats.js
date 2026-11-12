// Member performance stats. Real data will come from TrackMan once API access
// is granted (see fetchTrackmanSessions). Until then, members get clearly
// labelled sample data so the portal can be built and reviewed end to end.

export const CLUBS = ['Driver', '3 Wood', '5 Iron', '7 Iron', '9 Iron', 'PW']
const BASE_CARRY = { Driver: 228, '3 Wood': 205, '5 Iron': 178, '7 Iron': 156, '9 Iron': 132, PW: 112 }
const COURSES = ['Pebble Beach', 'St Andrews Old Course', 'Valhalla', 'Royal Troon', 'Kiawah Island Ocean Course', 'Oakland Hills South']

export function trackmanConfigured() {
  return Boolean(process.env.TRACKMAN_CLIENT_ID && process.env.TRACKMAN_CLIENT_SECRET)
}

// Placeholder for the real integration. Returns sessions in the same shape as
// sampleSessions() so nothing else changes when TrackMan access arrives.
export async function fetchTrackmanSessions(_member) {
  throw new Error('TrackMan integration not configured yet')
}

// Deterministic PRNG so a member always sees the same sample history.
function rng(seedStr) {
  let h = 2166136261
  for (const c of seedStr) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

const pad = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const round1 = (n) => Math.round(n * 10) / 10

export function sampleSessions(seed, today = new Date()) {
  const r = rng(seed)
  const skill = 0.85 + r() * 0.25
  const sessions = []
  const day = new Date(today)
  day.setDate(day.getDate() - 120)
  let i = 0
  while (day <= today) {
    if (r() < 0.24) {
      const progress = i / 40 // gradual improvement over time
      const isRound = r() < 0.35
      const carry = {}
      for (const club of CLUBS) {
        carry[club] = round1(BASE_CARRY[club] * skill * (1 + progress * 0.04) + (r() - 0.5) * 10)
      }
      const clubSpeed = round1(92 * skill * (1 + progress * 0.03) + (r() - 0.5) * 4)
      const smash = round1(1.38 + r() * 0.1 + progress * 0.01) 
      const s = {
        id: `sample-${ymd(day)}`,
        date: ymd(day),
        kind: isRound ? 'round' : 'practice',
        hours: r() < 0.6 ? 1 : 2,
        shots: isRound ? Math.round(80 + r() * 25) : Math.round(70 + r() * 90),
        clubSpeed,
        ballSpeed: round1(clubSpeed * Math.min(smash, 1.5)),
        smashFactor: Math.min(smash, 1.5),
        carry,
      }
      if (isRound) {
        s.course = COURSES[Math.floor(r() * COURSES.length)]
        s.score = Math.round(96 / skill - progress * 3 + (r() - 0.5) * 8)
      }
      sessions.push(s)
      i++
    }
    day.setDate(day.getDate() + 1)
  }
  return sessions
}

const avg = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)

export function summarize(sessions, today = new Date()) {
  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date))
  const cutoff = new Date(today)
  cutoff.setDate(cutoff.getDate() - 30)
  const recent = sorted.filter((s) => s.date >= ymd(cutoff))
  const rounds = sorted.filter((s) => s.kind === 'round' && s.score != null)

  const carryByClub = CLUBS.map((club) => ({
    club,
    carry: round1(avg((recent.length ? recent : sorted).map((s) => s.carry?.[club]).filter(Boolean)) || 0),
  }))

  const months = {}
  for (const s of sorted) {
    const k = s.date.slice(0, 7)
    months[k] = months[k] || { month: k, sessions: 0, hours: 0 }
    months[k].sessions++
    months[k].hours += s.hours
  }

  return {
    totals: {
      sessions: sorted.length,
      hours: sorted.reduce((a, s) => a + s.hours, 0),
      shots: sorted.reduce((a, s) => a + s.shots, 0),
      rounds: rounds.length,
    },
    last30: {
      sessions: recent.length,
      avgClubSpeed: round1(avg(recent.map((s) => s.clubSpeed)) || 0),
      avgBallSpeed: round1(avg(recent.map((s) => s.ballSpeed)) || 0),
      avgSmash: Math.round((avg(recent.map((s) => s.smashFactor)) || 0) * 100) / 100,
    },
    bestScore: rounds.length ? Math.min(...rounds.map((s) => s.score)) : null,
    avgScore: rounds.length ? round1(avg(rounds.map((s) => s.score))) : null,
    carryByClub,
    driverTrend: sorted.map((s) => ({ date: s.date, carry: s.carry?.Driver ?? null })).filter((p) => p.carry),
    scoreTrend: rounds.map((s) => ({ date: s.date, score: s.score, course: s.course })),
    monthly: Object.values(months),
    recentSessions: sorted.slice(-10).reverse(),
  }
}

export async function memberStats(member, storedSessions) {
  if (storedSessions.length) return { source: 'stored', ...summarize(storedSessions) }
  if (trackmanConfigured()) {
    try {
      return { source: 'trackman', ...summarize(await fetchTrackmanSessions(member)) }
    } catch (err) {
      console.warn('TrackMan fetch failed, falling back to sample data:', err.message)
    }
  }
  return { source: 'sample', ...summarize(sampleSessions(member.email)) }
}
