import { z } from 'zod'

import { ROBOTS_DIRECTIVES } from '@/types/domain'

/**
 * Per-entity SEO override, edited inline on the course/blog forms. Every field
 * is optional — leaving them blank means the public page auto-derives meta from
 * the entity's own title/description/image. `keywords` is a comma-separated
 * string in the form and split into an array on the server.
 */
export const entitySeoSchema = z.object({
  metaTitle: z.string().max(70, 'Keep under 70 characters').optional().or(z.literal('')),
  metaDescription: z
    .string()
    .max(160, 'Keep under 160 characters')
    .optional()
    .or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  canonicalUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  ogImage: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  robots: z.enum(ROBOTS_DIRECTIVES),
})

export type EntitySeoValues = z.infer<typeof entitySeoSchema>

export const ENTITY_SEO_DEFAULTS: EntitySeoValues = {
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  ogImage: '',
  robots: 'INDEX_FOLLOW',
}

/** Map a fetched entity's `seo` relation (array keywords) to form values. */
export function seoToFormValues(seo: {
  metaTitle?: string | null
  metaDescription?: string | null
  keywords?: string[] | null
  canonicalUrl?: string | null
  ogImage?: string | null
  robots?: EntitySeoValues['robots'] | null
} | null | undefined): EntitySeoValues {
  if (!seo) return ENTITY_SEO_DEFAULTS
  return {
    metaTitle: seo.metaTitle ?? '',
    metaDescription: seo.metaDescription ?? '',
    keywords: (seo.keywords ?? []).join(', '),
    canonicalUrl: seo.canonicalUrl ?? '',
    ogImage: seo.ogImage ?? '',
    robots: seo.robots ?? 'INDEX_FOLLOW',
  }
}
