import { PERMISSIONS, type Permission, type UserRole } from '@/types/domain'

/** Presentation metadata for an RBAC permission. */
export interface PermissionMeta {
  key: Permission
  label: string
  description: string
  /** The portal route this permission unlocks. */
  to: string
  /**
   * Only the full-access role (SUPER_ADMIN) ever holds this. It is never
   * offered when an admin issues credentials to another user.
   */
  adminOnly?: boolean
}

export const PERMISSION_META: Record<Permission, PermissionMeta> = {
  leads: {
    key: 'leads',
    label: 'Leads',
    description: 'View and manage incoming enquiries.',
    to: '/leads',
  },
  courseEnquiries: {
    key: 'courseEnquiries',
    label: 'Course Enquiries',
    description: 'Triage "Enroll Now" enquiries from the website.',
    to: '/course-enquiries',
  },
  courses: {
    key: 'courses',
    label: 'Courses',
    description: 'Create and publish training courses.',
    to: '/courses',
  },
  blogs: {
    key: 'blogs',
    label: 'Blogs',
    description: 'Author and publish blog posts.',
    to: '/blogs',
  },
  categories: {
    key: 'categories',
    label: 'Categories',
    description: 'Organise blog categories.',
    to: '/categories',
  },
  faqs: {
    key: 'faqs',
    label: 'FAQs',
    description: 'Maintain frequently asked questions.',
    to: '/faqs',
  },
  reviews: {
    key: 'reviews',
    label: 'Reviews',
    description: 'Manage student reviews and ratings.',
    to: '/reviews',
  },
  placements: {
    key: 'placements',
    label: 'Placements',
    description: 'Showcase student placements.',
    to: '/placements',
  },
  media: {
    key: 'media',
    label: 'Media',
    description: 'Upload and manage media assets.',
    to: '/media',
  },
  seo: {
    key: 'seo',
    label: 'SEO',
    description: 'Manage SEO metadata.',
    to: '/seo',
  },
  batchScheduleHome: {
    key: 'batchScheduleHome',
    label: 'Batch Schedule — Home',
    description: 'Manage the upcoming-batches schedule shown on the home page.',
    to: '/batch-schedule/home',
  },
  batchScheduleCourse: {
    key: 'batchScheduleCourse',
    label: 'Batch Schedule — Course',
    description: 'Manage the per-course batch schedule shown on course pages.',
    to: '/batch-schedule/course',
  },
  credentials: {
    key: 'credentials',
    label: 'Credentials & Access',
    description: 'Issue, reset and revoke user credentials.',
    to: '/credentials',
    adminOnly: true,
  },
}

/** Ordered list of permissions an admin can grant when issuing credentials. */
export const GRANTABLE_PERMISSIONS: PermissionMeta[] = PERMISSIONS.map(
  (key) => PERMISSION_META[key],
).filter((meta) => !meta.adminOnly)

/**
 * Source of truth for what each role can reach. SUPER_ADMIN is intentionally
 * absent — it bypasses these checks via `roleHasFullAccess` and implicitly
 * holds every permission, including the super-admin-only `credentials` module.
 *
 * Extend a role by adding permission keys here ("scope for more"); the nav,
 * route guards and credential previews all derive from this map.
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [...PERMISSIONS],
  ADMIN: ['courseEnquiries', 'blogs', 'batchScheduleHome', 'batchScheduleCourse'],
  CONTENT_MANAGER: ['courses', 'blogs', 'categories', 'faqs', 'reviews', 'placements', 'media'],
  SEO_MANAGER: ['seo'],
}

/** The only role that bypasses per-route checks and owns credential management. */
export function roleHasFullAccess(role: UserRole): boolean {
  return role === 'SUPER_ADMIN'
}

/** Permissions a role resolves to (the full set for the full-access role). */
export function permissionsForRole(role: UserRole): Permission[] {
  if (roleHasFullAccess(role)) return [...PERMISSIONS]
  return ROLE_PERMISSIONS[role] ?? []
}

/** Whether `user` may access the route guarded by `permission`. */
export function hasPermission(
  user: { role: UserRole; permissions?: Permission[] } | null | undefined,
  permission: Permission,
): boolean {
  if (!user) return false
  if (roleHasFullAccess(user.role)) return true
  // The credentials module is reserved for the full-access role only.
  if (PERMISSION_META[permission].adminOnly) return false
  // Role defaults, plus any explicit per-user grant (reserved for future use).
  const granted = ROLE_PERMISSIONS[user.role] ?? []
  return granted.includes(permission) || (user.permissions?.includes(permission) ?? false)
}

/** Whether `user` may open the Credentials & Access module. */
export function canManageCredentials(
  user: { role: UserRole } | null | undefined,
): boolean {
  return !!user && roleHasFullAccess(user.role)
}
