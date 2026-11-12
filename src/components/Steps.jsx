export default function Steps({ steps }) {
  return (
    <ol className="steps-grid">
      {steps.map((s, i) => (
        <li key={i} className="step">
          <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  )
}
