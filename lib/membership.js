// Membership plans and hour accounting. Plan terms match the public
// Memberships page (src/content.js).
export const PLANS = {
  silver: { name: 'Silver', price: 109, includedHours: 3, discountPct: 15 },
  gold: { name: 'Gold', price: 199, includedHours: 6, discountPct: 20 },
}

const pad = (n) => String(n).padStart(2, '0')
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Billing cycles run from the member's billing day each month. Days past the
// end of a short month (e.g. the 31st) clamp to that month's last day.
function cycleDate(year, month, day) {
  const last = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(day, last))
}

export function currentCycle(billingDay, today = new Date()) {
  const day = Math.min(Math.max(Number(billingDay) || 1, 1), 31)
  let start = cycleDate(today.getFullYear(), today.getMonth(), day)
  if (start > today) start = cycleDate(today.getFullYear(), today.getMonth() - 1, day)
  const end = cycleDate(start.getFullYear(), start.getMonth() + 1, day)
  return { start: ymd(start), end: ymd(end) } // end is exclusive (next renewal)
}

// usage: [{ date: 'YYYY-MM-DD', hours, type: 'included' | 'extra' }]
export function hoursSummary(member, usage, today = new Date()) {
  const plan = PLANS[member.plan]
  if (!plan) return null
  const cycle = currentCycle(member.billingDay, today)
  const inCycle = usage.filter((u) => u.date >= cycle.start && u.date < cycle.end)
  const sum = (type) => inCycle.filter((u) => u.type === type).reduce((s, u) => s + Number(u.hours || 0), 0)
  const used = sum('included')
  return {
    plan: { key: member.plan, ...plan },
    cycle,
    includedHours: plan.includedHours,
    usedHours: used,
    remainingHours: Math.max(plan.includedHours - used, 0),
    extraHours: sum('extra'),
  }
}

export function publicMember(m) {
  if (!m) return null
  const { notes, ...rest } = m
  return rest
}
