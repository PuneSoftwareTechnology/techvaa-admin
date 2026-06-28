/**
 * Domain entities — kept in lock-step with the Prisma schema used by the
 * Techvaa website (prisma/schema.prisma). Dates are serialised as ISO strings
 * over the wire.
 */

export type ISODateString = string

// ── Enums ────────────────────────────────────────────────────────────────
export const USER_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MARKETING_EXECUTIVE'] as const
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
  'curriculum',
  'blogs',
  'faqs',
  'reviews',
  'testimonials',
  'placements',
  'batchSchedule',
  'credentials',
] as const
export type Permission = (typeof PERMISSIONS)[number]

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
  /** Short blurb shown on course cards. */
  shortDescription?: string | null
  description: string
  /** Human-readable length, e.g. "6 weeks", "40 hours". */
  duration?: string | null
  image?: string | null
  /** "About the Trainer" heading, shown after the curriculum. */
  trainerHeading?: string | null
  /** "About the Trainer" description (HTML), shown after the curriculum. */
  trainerDescription?: string | null
  isFeatured: boolean
  isPublished: boolean
  /** Curated related courses (included on reads). */
  relatedCourses?: Pick<Course, 'id' | 'title' | 'slug'>[]
  /** Flattened related-course ids (derived server-side for the form). */
  relatedCourseIds?: string[]
  /** Ordered key-curriculum items (included on reads). */
  curriculum?: CurriculumItem[]
  /** Upcoming batches for this course (included on reads). */
  batches?: CourseBatch[]
  seo?: SeoMetadata | null
}

/** A single Key-Curriculum row (heading + description), attached to a course. */
export interface CurriculumItem {
  id: string
  courseId: string
  heading: string
  description: string
  sortOrder: number
  /** Parent course (included on reads). */
  course?: Pick<Course, 'id' | 'title' | 'slug'>
}

/** Enrollment state of a scheduled batch, surfaced as a badge on the site. */
export type BatchStatus = 'ENROLLMENT_OPEN' | 'LIMITED_SEATS' | 'FILLING_FAST'

/** An upcoming batch / new batch schedule for a course. */
export interface CourseBatch {
  id: string
  courseId: string
  startDate: ISODateString
  duration: string
  /** Delivery mode, e.g. "Instructor Led Training". */
  mode?: string | null
  /** Human-readable schedule, e.g. "Weekdays 9–11 AM". */
  timing?: string | null
  status: BatchStatus
  isOpen: boolean
  createdAt: ISODateString
  /** Parent course (included on reads). */
  course?: Pick<Course, 'id' | 'title' | 'slug'>
}

export interface Blog extends Timestamps {
  id: string
  title: string
  slug: string
  metaDescription?: string | null
  featuredImage?: string | null
  introduction: string

  primaryTitle?: string | null
  primaryImage?: string | null
  primaryIntro?: string | null
  primaryText?: string | null

  secondaryTitle?: string | null
  secondaryImage?: string | null
  secondaryIntro?: string | null
  secondaryText?: string | null

  tertiaryTitle?: string | null
  tertiaryIntro?: string | null
  tertiaryText?: string | null
  tertiaryPoints: string[]

  conclusion?: string | null

  showOnHomepage: boolean
  isPublished: boolean
  publishedAt?: ISODateString | null
  relatedCourseIds?: string[]
  relatedCourses?: Pick<Course, 'id' | 'title' | 'slug'>[]
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

export interface Testimonial extends Timestamps {
  id: string
  name: string
  role?: string | null
  company?: string | null
  message: string
  image?: string | null
  videoUrl?: string | null
  isPublished: boolean
  showOnHomepage: boolean
  courseIds?: string[]
  courses?: Pick<Course, 'id' | 'title' | 'slug'>[]
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
