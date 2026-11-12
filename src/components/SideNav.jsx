import { useLayoutEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const ICONS = {
  overview: <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />,
  stats: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  account: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></>,
  admin: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />,
  members: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5M16 4.5a3.5 3.5 0 0 1 0 7M22 20c0-3-2-4.8-5-5.3" /></>,
  waivers: <><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h8M9 17h6" /></>,
}

export function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  )
}

// Vertical tabs with a brass marker that glides to the active item.
// items: [{ key, label, icon, to?, end?, onClick?, active? }]
export default function SideNav({ items, header, footer }) {
  const listRef = useRef(null)
  const [marker, setMarker] = useState(null)
  const { pathname } = useLocation()
  const activeKey = items.find((i) => i.active)?.key

  useLayoutEffect(() => {
    const el = listRef.current?.querySelector('.side-item.active')
    if (!el) return setMarker(null)
    setMarker({ top: el.offsetTop, left: el.offsetLeft, height: el.offsetHeight, width: el.offsetWidth })
  }, [pathname, activeKey])

  return (
    <aside className="side">
      {header}
      <nav className="side-list" ref={listRef}>
        {marker && (
          <span
            className="side-marker"
            style={{ '--top': `${marker.top}px`, '--left': `${marker.left}px`, '--h': `${marker.height}px`, '--w': `${marker.width}px` }}
          />
        )}
        {items.map((i) =>
          i.to ? (
            <NavLink key={i.key} to={i.to} end={i.end} className={({ isActive }) => `side-item ${isActive ? 'active' : ''}`}>
              <Icon name={i.icon} /><span>{i.label}</span>
            </NavLink>
          ) : (
            <button key={i.key} type="button" onClick={i.onClick} className={`side-item ${i.active ? 'active' : ''}`}>
              <Icon name={i.icon} /><span>{i.label}</span>
            </button>
          ),
        )}
      </nav>
      {footer}
    </aside>
  )
}
