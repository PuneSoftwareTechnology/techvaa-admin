import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../store/auth.store'

/** For auth-only pages (login). Sends already-authenticated users home. */
export function PublicRoute() {
  const status = useAuthStore((s) => s.status)

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
