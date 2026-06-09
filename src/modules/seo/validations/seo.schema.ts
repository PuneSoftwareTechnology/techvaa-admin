import { z } from 'zod'

import { ROBOTS_DIRECTIVES } from '@/types/domain'

export const seoSchema = z.object({
  page: z.string().min(1, 'Page name is required'),
  path: z.string().min(1, 'Path is required').regex(/^\//, 'Must start with /'),
  metaTitle: z.string().min(1, 'Meta title is required').max(70, 'Keep under 70 characters'),
  metaDescription: z.string().min(1, 'Meta description is required').max(160, 'Keep under 160 characters'),
  keywords: z.string().optional().or(z.literal('')),
  canonicalUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  ogImage: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  robots: z.enum(ROBOTS_DIRECTIVES),
})

export type SeoFormValues = z.infer<typeof seoSchema>

export const SEO_DEFAULTS: SeoFormValues = {
  page: '',
  path: '/',
  metaTitle: '',
  metaDescription: '',
  keywords: '',
  canonicalUrl: '',
  ogImage: '',
  robots: 'INDEX_FOLLOW',
}
