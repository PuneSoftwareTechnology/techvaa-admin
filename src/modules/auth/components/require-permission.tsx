import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { hasPermission } from '@/constants/permissions'
import type { Permission } from '@/types/domain'
import { useAuthStore } from '../store/auth.store'

interface RequirePermissionProps {
  permission: Permission
  children: ReactNode
}

/**
 * Route-level RBAC gate. Renders its children only when the signed-in user
 * holds `permission`; otherwise it bounces them back to the dashboard (which
 * every authenticated user can reach). Pair with <ProtectedRoute> for auth.
 */
export function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const user = useAuthStore((s) => s.user)

  if (!hasPermission(user, permission)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
