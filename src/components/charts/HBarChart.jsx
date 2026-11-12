import { useState } from 'react'

// Horizontal bars: one series, direct value labels, hover/focus highlight.
export default function HBarChart({ data, label, value, unit = '', ariaLabel }) {
  const [active, setActive] = useState(null)
  const max = Math.max(...data.map(value), 1)
  return (
    <div className="hbar" role="img" aria-label={ariaLabel}>
      {data.map((d, i) => {
        const v = value(d)
        return (
          <div
            key={label(d)}
            className={`hbar-row ${active === i ? 'is-active' : ''}`}
            tabIndex={0}
            onPointerEnter={() => setActive(i)}
            onPointerLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <span className="hbar-label">{label(d)}</span>
            <span className="hbar-track">
              <span className="hbar-fill" style={{ width: `${(v / max) * 100}%` }} />
            </span>
            <span className="hbar-value">{Math.round(v)}{unit}</span>
          </div>
        )
      })}
    </div>
  )
}
