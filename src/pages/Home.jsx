import { Link } from 'react-router-dom'
import HeroSlides from '../components/HeroSlides.jsx'
import { hero, heroImages, highlights, options, tech } from '../content.js'

export default function Home() {
  return (
    <section className="home fill">
      <HeroSlides images={heroImages} />
      <div className="container home-grid">
        <div className="home-hero">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1>{hero.title} <em>{hero.titleAccent}</em></h1>
          <p className="lead">{hero.lead}</p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-primary">Book a tee time</Link>
            <Link to="/memberships" className="btn btn-ghost">Memberships</Link>
          </div>
          <ul className="highlights">
            {highlights.map((h) => <li key={h}>{h}</li>)}
          </ul>
        </div>
        <div className="option-grid">
          {options.items.map((o) => {
            const body = (
              <>
                <span className="option-price">{o.price}</span>
                <h3>{o.title}</h3>
                <p>{o.body}</p>
                <span className="option-cta">{o.cta} →</span>
              </>
            )
            return o.to ? (
              <Link key={o.key} to={o.to} className="option">{body}</Link>
            ) : (
              <a key={o.key} href={o.href} className="option" {...(o.external ? { target: '_blank', rel: 'noreferrer' } : {})}>{body}</a>
            )
          })}
        </div>
      </div>
      <div className="tech-strip">
        <div className="container tech-grid">
          <p className="eyebrow">{tech.title}</p>
          {tech.items.map((t) => (
            <div key={t.title} className="tech-item">
              <h3>{t.title}</h3>
              <p>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
