import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, useApi } from '../lib/auth.jsx'

export default function PortalLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const me = useApi('/api/me')

  if (user === undefined) return <div className="portal-loading" />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  return (
    <div className="portal">
      <div className="portal-bar">
        <div className="container portal-bar-inner">
          <nav className="tabs">
            <NavLink to="/portal" end>Overview</NavLink>
            <NavLink to="/portal/stats">Stats</NavLink>
            <NavLink to="/portal/account">Account</NavLink>
            {me.data?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <button className="linkish" onClick={signOut}>Sign out</button>
        </div>
      </div>
      <div className="container portal-body">
        {me.loading && !me.data ? (
          <div className="portal-loading" />
        ) : me.error ? (
          <p className="error">{me.error.message}</p>
        ) : (
          <Outlet context={me} />
        )}
      </div>
    </div>
  )
}
