import type { User } from '@/types/domain'
import { nowIso } from './utils'

/** Seeded admin record + credential for the in-memory mock backend. */
export interface MockUser extends User {
  password: string
}

export const SEED_USERS: MockUser[] = [
  {
    id: 'usr_admin',
    name: 'Techvaa Admin',
    email: 'admin@techvaa.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    // The full-access role is not gated by this list, but we keep it complete.
    permissions: [
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
    ],
    isActive: true,
    lastLoginAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'usr_marketing',
    name: 'Priya Nair',
    email: 'marketing@techvaa.com',
    password: 'content123',
    role: 'MARKETING_EXECUTIVE',
    // Role-derived access: a marketing executive can manage blogs only.
    permissions: ['blogs'],
    isActive: true,
    lastLoginAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
]
