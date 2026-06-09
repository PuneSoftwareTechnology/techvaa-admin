import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuthStore } from '../store/auth.store'

/** Gate for authenticated routes. Redirects to /login, preserving intent. */
export function ProtectedRoute() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
