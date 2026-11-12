import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth, useApi } from '../lib/auth.jsx'
import SideNav from '../components/SideNav.jsx'

export default function PortalLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const me = useApi('/api/me')

  if (user === undefined) return <div className="portal-loading" />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  const m = me.data?.member
  const items = [
    { key: 'overview', label: 'Overview', icon: 'overview', to: '/portal', end: true },
    { key: 'stats', label: 'Stats', icon: 'stats', to: '/portal/stats' },
    { key: 'account', label: 'Account', icon: 'account', to: '/portal/account' },
    ...(me.data?.isAdmin ? [{ key: 'admin', label: 'Admin', icon: 'admin', to: '/admin' }] : []),
  ]

  return (
    <div className="container shell">
      <SideNav
        items={items}
        header={
          <div className="side-head">
            <strong>{m?.name || user.email}</strong>
            {m && <span>{me.data?.hours?.plan.name || m.plan} member</span>}
          </div>
        }
        footer={<button className="side-signout" onClick={signOut}>Sign out</button>}
      />
      <div className="shell-main">
        {me.loading && !me.data ? (
          <div className="portal-loading" />
        ) : me.error ? (
          <p className="error">{me.error.message}</p>
        ) : (
          <div className="page-enter" key={location.pathname}>
            <Outlet context={me} />
          </div>
        )}
      </div>
    </div>
  )
}
