import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { hasPermission } from '@/constants/permissions'
import type { Permission } from '@/types/domain'
import { useAuthStore } from '../store/auth.store'

interface RequirePermissionProps {
  /** A single permission, or several of which the user needs hold any one. */
  permission: Permission | Permission[]
  children: ReactNode
}

/**
 * Route-level RBAC gate. Renders its children only when the signed-in user
 * holds `permission` (or, when given a list, any one of them); otherwise it
 * bounces them back to the dashboard (which every authenticated user can
 * reach). Pair with <ProtectedRoute> for auth.
 */
export function RequirePermission({
  permission,
  children,
}: RequirePermissionProps) {
  const user = useAuthStore((s) => s.user)
  const required = Array.isArray(permission) ? permission : [permission]

  if (!required.some((p) => hasPermission(user, p))) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
