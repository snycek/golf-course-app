// Bookkeeping: income and expense entries the owner records by hand.
// Amounts are stored in cents to avoid floating-point drift.
export const EXPENSE_CATEGORIES = [
  'Rent', 'Utilities', 'TrackMan subscription', 'Equipment & repairs', 'Supplies',
  'Vending stock', 'Insurance', 'Marketing', 'Software & fees', 'Cleaning', 'Taxes', 'Other',
]
export const INCOME_CATEGORIES = ['Booking payouts', 'Memberships', 'Private events', 'Gift cards', 'Vending', 'Other']
export const METHODS = ['Card', 'Bank transfer', 'Cash', 'Check', 'Other']

const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

// Returns { entry } or { error }.
export function parseEntry(b = {}) {
  const type = b.type === 'income' ? 'income' : 'expense'
  const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
  const amount = Math.round(Number(String(b.amount ?? '').replace(/[$,\s]/g, '')) * 100)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date || '')) return { error: 'Pick a date.' }
  if (!Number.isFinite(amount) || amount <= 0 || amount > 100_000_000) return { error: 'Enter an amount.' }
  if (!cats.includes(b.category)) return { error: 'Choose a category.' }
  return {
    entry: {
      type,
      date: b.date,
      amountCents: amount,
      category: b.category,
      vendor: str(b.vendor, 120),
      method: METHODS.includes(b.method) ? b.method : '',
      note: str(b.note, 500),
    },
  }
}
