import { useRef, useState } from 'react'

// Single-series line with a crosshair tooltip that snaps to the nearest point.
// data: [{ x: 'YYYY-MM-DD', y: number, note?: string }]
export default function LineChart({ data, formatX, formatY, ariaLabel, height = 200, invert = false }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(null)
  if (data.length < 2) return <p className="muted small">Not enough sessions yet.</p>

  const W = 600
  const H = height
  const pad = { t: 14, r: 14, b: 30, l: 58 }
  const ys = data.map((d) => d.y)
  let lo = Math.min(...ys)
  let hi = Math.max(...ys)
  const span = hi - lo || 1
  lo = Math.floor(lo - span * 0.15)
  hi = Math.ceil(hi + span * 0.15)
  const x = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r)
  const y = (v) => {
    const t = (v - lo) / (hi - lo)
    return pad.t + (invert ? t : 1 - t) * (H - pad.t - pad.b)
  }
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.y).toFixed(1)}`).join('')
  const ticks = [lo, Math.round((lo + hi) / 2), hi]
  const xTicks = [0, Math.floor((data.length - 1) / 2), data.length - 1]

  function move(e) {
    const box = ref.current.getBoundingClientRect()
    const px = ((e.clientX - box.left) / box.width) * W
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }

  const h = hover != null ? data[hover] : null
  return (
    <div className="line-chart">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        onPointerMove={move}
        onPointerLeave={() => setHover(null)}
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="grid" />
            <text x={pad.l - 8} y={y(t) + 4} className="axis" textAnchor="end">{formatY(t)}</text>
          </g>
        ))}
        {xTicks.map((i) => (
          <text key={i} x={x(i)} y={H - 6} className="axis" textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>
            {formatX(data[i].x)}
          </text>
        ))}
        <path d={path} className="line" />
        {h && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} className="crosshair" />
            <circle cx={x(hover)} cy={y(h.y)} r={5} className="dot" />
          </>
        )}
      </svg>
      {h && (
        <div className="tip" style={{ left: `${(x(hover) / W) * 100}%` }}>
          <strong>{formatY(h.y)}</strong>
          <span>{formatX(h.x)}{h.note ? ` · ${h.note}` : ''}</span>
        </div>
      )}
    </div>
  )
}
