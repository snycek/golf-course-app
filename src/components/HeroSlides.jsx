import { useEffect, useState } from 'react'

// Faded background photos that drift slowly sideways and crossfade every few
// seconds — a watermark behind the home page, not a carousel to look at.
export default function HeroSlides({ images, interval = 7000 }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (images.length < 2) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % images.length), interval)
    return () => clearInterval(t)
  }, [images.length, interval])

  if (!images.length) return null
  return (
    <div className="hero-slides" aria-hidden="true">
      {images.map((src, n) => (
        <div
          key={src}
          className={`hero-slide ${n === i ? 'on' : ''} ${n % 2 ? 'rev' : ''}`}
          style={{ backgroundImage: `url(${src})`, animationDuration: `${interval * 2.2}ms` }}
        />
      ))}
    </div>
  )
}
