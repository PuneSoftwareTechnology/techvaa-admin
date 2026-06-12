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
      'faqs',
      'reviews',
      'testimonials',
      'placements',
      'media',
      'seo',
      'batchSchedule',
      'credentials',
    ],
    isActive: true,
    lastLoginAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: 'usr_content',
    name: 'Priya Nair',
    email: 'content@techvaa.com',
    password: 'content123',
    role: 'CONTENT_MANAGER',
    // Role-derived access: a content manager handles site content modules.
    permissions: ['courses', 'blogs', 'faqs', 'reviews', 'testimonials', 'placements', 'media'],
    isActive: true,
    lastLoginAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
]
