import PageHeader from '../components/PageHeader.jsx'
import { about } from '../content.js'

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Our story" title={about.heading} />
      <section className="section">
        <div className="container narrow prose">
          {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </section>
    </>
  )
}
