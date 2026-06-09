import type { Entity } from '@/types/crud'
import type { RobotsDirective } from '@/types/domain'

/** Page-scoped SEO metadata record managed by the admin. */
export interface SeoEntry extends Entity {
  page: string
  path: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  canonicalUrl?: string | null
  ogImage?: string | null
  robots: RobotsDirective
}
