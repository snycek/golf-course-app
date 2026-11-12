// Booking progress as a hole: tee → fairway → green → cup.
// The ball rolls along the track to the current step; the flag marks the end.
export default function GolfProgress({ steps, current, onStep }) {
  const pct = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0
  return (
    <div className="golf-progress" aria-label={`Step ${current + 1} of ${steps.length}: ${steps[current]}`}>
      <div className="gp-track">
        <div className="gp-fill" style={{ width: `${pct}%` }} />
        <svg className="gp-flag" viewBox="0 0 24 36" aria-hidden="true">
          <line x1="5" y1="2" x2="5" y2="34" />
          <path d="M5 3 L21 8.5 L5 14 Z" />
          <ellipse cx="5" cy="34" rx="4.5" ry="1.6" />
        </svg>
        <span className="gp-ball" style={{ left: `${pct}%` }} aria-hidden="true" />
      </div>
      <ol className="gp-steps">
        {steps.map((s, i) => (
          <li
            key={s}
            className={i < current ? 'done' : i === current ? 'current' : ''}
            style={{ left: `${(i / (steps.length - 1)) * 100}%` }}
          >
            <button type="button" disabled={i > current} onClick={() => onStep(i)} aria-current={i === current ? 'step' : undefined}>
              <span className="gp-num">{i + 1}</span>
              {s}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
