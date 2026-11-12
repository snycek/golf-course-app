const pad = (n) => String(n).padStart(2, '0')

export function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const todayYmd = () => {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
export const fmtDate = (s, opts = { month: 'short', day: 'numeric' }) => parseYmd(s).toLocaleDateString(undefined, opts)
export const fmtLongDate = (s) => fmtDate(s, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
export const fmtMonth = (ym) => parseYmd(`${ym}-01`).toLocaleDateString(undefined, { month: 'short' })
export const fmtHours = (h) => `${h % 1 ? h.toFixed(1) : h} hr${h === 1 ? '' : 's'}`
export const fmtNum = (n) => Number(n).toLocaleString()
