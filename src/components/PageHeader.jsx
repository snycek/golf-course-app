export default function PageHeader({ eyebrow, title, children, note }) {
  return (
    <section className="page-header">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p className="lead">{children}</p>}
        {note && <p className="note">{note}</p>}
      </div>
    </section>
  )
}
