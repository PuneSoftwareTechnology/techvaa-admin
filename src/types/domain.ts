/**
 * Domain entities — kept in lock-step with the Prisma schema used by the
 * Techvaa website (prisma/schema.prisma). Dates are serialised as ISO strings
 * over the wire.
 */

export type ISODateString = string

// ── Enums ────────────────────────────────────────────────────────────────
export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'CONTENT_MANAGER', 'SEO_MANAGER'] as const
export type UserRole = (typeof USER_ROLES)[number]

/**
 * RBAC permission keys. Each maps 1:1 to a guarded portal route. Every role
 * resolves to a fixed set of these (see ROLE_PERMISSIONS); SUPER_ADMIN bypasses
 * the checks entirely and implicitly holds every permission. The list is kept
 * deliberately broad ("scope for more") so new modules can be granted to a role
 * without reshaping the model. `credentials` is super-admin-only and is never
 * grantable to other roles (it controls this very module).
 */
export const PERMISSIONS = [
  'leads',
  'courseEnquiries',
  'courses',
  'blogs',
  'categories',
  'faqs',
  'reviews',
  'placements',
  'media',
  'seo',
  'batchScheduleHome',
  'batchScheduleCourse',
  'credentials',
] as const
export type Permission = (typeof PERMISSIONS)[number]

export const COURSE_LEVELS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'ALL_LEVELS',
] as const
export type CourseLevel = (typeof COURSE_LEVELS)[number]

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'CLOSED',
  'LOST',
] as const
export type LeadStatus = (typeof LEAD_STATUSES)[number]

export const ROBOTS_DIRECTIVES = [
  'INDEX_FOLLOW',
  'NOINDEX_FOLLOW',
  'INDEX_NOFOLLOW',
  'NOINDEX_NOFOLLOW',
] as const
export type RobotsDirective = (typeof ROBOTS_DIRECTIVES)[number]

// ── Base ─────────────────────────────────────────────────────────────────
interface Timestamps {
  createdAt: ISODateString
  updatedAt: ISODateString
}

// ── SEO ──────────────────────────────────────────────────────────────────
export interface SeoMetadata {
  id: string
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  keywords: string[]
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  robots: RobotsDirective
  schemaMarkup?: unknown | null
}

// ── Entities ─────────────────────────────────────────────────────────────
export interface User extends Timestamps {
  id: string
  name: string
  email: string
  role: UserRole
  /** Route permissions granted to this user. Ignored for full-access roles. */
  permissions: Permission[]
  isActive: boolean
  lastLoginAt?: ISODateString | null
}

export interface Course extends Timestamps {
  id: string
  title: string
  slug: string
  shortDescription?: string | null
  description: string
  duration?: string | null
  level: CourseLevel
  image?: string | null
  isFeatured: boolean
  isPublished: boolean
  seo?: SeoMetadata | null
}

export interface BlogCategory extends Timestamps {
  id: string
  name: string
  slug: string
  description?: string | null
  blogCount?: number
}

export interface Blog extends Timestamps {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featuredImage?: string | null
  readingTime?: number | null
  isPublished: boolean
  publishedAt?: ISODateString | null
  categoryId: string
  category?: Pick<BlogCategory, 'id' | 'name' | 'slug'> | null
  seo?: SeoMetadata | null
}

export interface Review extends Timestamps {
  id: string
  studentName: string
  company?: string | null
  designation?: string | null
  rating: number
  review: string
  image?: string | null
  isPublished: boolean
}

export interface Placement extends Timestamps {
  id: string
  studentName: string
  company: string
  package?: string | null
  course?: string | null
  image?: string | null
  linkedinUrl?: string | null
  joiningDate?: ISODateString | null
  isPublished: boolean
}

export interface Faq extends Timestamps {
  id: string
  question: string
  answer: string
  sortOrder: number
  isPublished: boolean
  showOnHomepage: boolean
  /** Courses this FAQ is attached to (included on reads). */
  courses?: Pick<Course, 'id' | 'title' | 'slug'>[]
  /** Flattened course ids (derived server-side for the form). */
  courseIds?: string[]
}

export interface Lead extends Timestamps {
  id: string
  name: string
  email: string
  phone?: string | null
  message?: string | null
  courseInterest?: string | null
  status: LeadStatus
}

/**
 * "Enroll Now" enquiry from the website's upcoming-batches table. The course is
 * pre-selected from the batch row; no email is collected (name + phone only).
 * Shares the LeadStatus lifecycle so it triages with the same workflow.
 */
export interface CourseEnquiry extends Timestamps {
  id: string
  name: string
  phone: string
  course: string
  message?: string | null
  status: LeadStatus
}

export interface Media {
  id: string
  fileName: string
  originalName: string
  fileType: string
  fileSize: number
  url: string
  createdAt: ISODateString
  uploadedById?: string | null
}
