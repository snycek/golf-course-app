// Ring meter for included hours used this billing cycle.
export default function HoursRing({ used, total }) {
  const r = 52
  const c = 2 * Math.PI * r
  const pct = total ? Math.min(used / total, 1) : 0
  const left = Math.max(total - used, 0)
  return (
    <div className="ring" role="img" aria-label={`${left} of ${total} hours left`}>
      <svg viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} className="ring-track" />
        <circle
          cx="60" cy="60" r={r} className="ring-fill"
          strokeDasharray={`${c * pct} ${c}`}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="ring-center">
        <strong>{left % 1 ? left.toFixed(1) : left}</strong>
        <span>of {total} hrs left</span>
      </div>
    </div>
  )
}
