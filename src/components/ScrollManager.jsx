import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Resets scroll on page change. On desktop the page itself doesn't scroll —
// <main> does when content overflows — so reset both.
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
    const main = document.getElementById('main')
    if (main) main.scrollTop = 0
  }, [pathname, hash])
  return null
}
