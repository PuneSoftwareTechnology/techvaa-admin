import { MockCollection } from '@/api/mock/collection'
import { createCrudRepository } from '@/api/crud-repository'
import type { SeoEntry } from '../types'

/** Self-contained mock store so the SEO module touches no shared files. */
const iso = (d: number) => new Date(Date.UTC(2026, 3, d)).toISOString()

const SEO_SEED: SeoEntry[] = [
  {
    id: 'seo_home',
    page: 'Home',
    path: '/',
    metaTitle: 'Techvaa — #1 SAP Training Institute in India',
    metaDescription:
      'Master SAP with India’s leading institute. Live S/4HANA labs, expert trainers and 100% placement assistance.',
    keywords: ['SAP training', 'SAP course', 'S/4HANA', 'SAP institute'],
    canonicalUrl: 'https://techvaa.com/',
    ogImage: 'https://techvaa.com/og/home.png',
    robots: 'INDEX_FOLLOW',
    createdAt: iso(1),
    updatedAt: iso(20),
  },
  {
    id: 'seo_courses',
    page: 'Courses',
    path: '/courses',
    metaTitle: 'SAP Courses — FICO, MM, ABAP, SD & More | Techvaa',
    metaDescription:
      'Browse industry-aligned SAP courses with hands-on projects, certification prep and placement support.',
    keywords: ['SAP FICO', 'SAP MM', 'SAP ABAP', 'SAP courses'],
    canonicalUrl: 'https://techvaa.com/courses',
    ogImage: 'https://techvaa.com/og/courses.png',
    robots: 'INDEX_FOLLOW',
    createdAt: iso(2),
    updatedAt: iso(18),
  },
  {
    id: 'seo_blog',
    page: 'Blog',
    path: '/blog',
    metaTitle: 'SAP Blog — Careers, Tips & Industry News | Techvaa',
    metaDescription:
      'Expert articles on SAP careers, module guides, interview prep and the latest SAP ecosystem news.',
    keywords: ['SAP blog', 'SAP careers', 'SAP tips'],
    canonicalUrl: 'https://techvaa.com/blog',
    ogImage: 'https://techvaa.com/og/blog.png',
    robots: 'INDEX_FOLLOW',
    createdAt: iso(3),
    updatedAt: iso(12),
  },
  {
    id: 'seo_placements',
    page: 'Placements',
    path: '/placements',
    metaTitle: 'SAP Placements & Success Stories | Techvaa',
    metaDescription:
      'See how Techvaa learners landed SAP roles at top companies with packages up to 14 LPA.',
    keywords: ['SAP placements', 'SAP jobs', 'SAP success stories'],
    canonicalUrl: 'https://techvaa.com/placements',
    ogImage: 'https://techvaa.com/og/placements.png',
    robots: 'INDEX_FOLLOW',
    createdAt: iso(4),
    updatedAt: iso(9),
  },
]

const collection = new MockCollection<SeoEntry>(SEO_SEED, {
  idPrefix: 'seo',
  searchFields: ['page', 'path', 'metaTitle'],
})

/**
 * Tier-1 page SEO is now backed by the `page_seo` table via the admin's own
 * `/api/page-seo` route (the `collection` above is the mock fallback used when
 * NEXT_PUBLIC_USE_MOCK=true). Per-course/blog SEO lives on SeoMetadata and is
 * edited inline on the course/blog forms — not here.
 */
export const seoRepository = createCrudRepository<
  SeoEntry,
  Partial<SeoEntry>,
  Partial<SeoEntry>
>('page-seo', collection)
