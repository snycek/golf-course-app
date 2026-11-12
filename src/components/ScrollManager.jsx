import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scrolls to #section anchors (e.g. /#faqs) and to the top on page changes.
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
  }, [pathname, hash])
  return null
}
