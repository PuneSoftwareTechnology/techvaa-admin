import { z } from 'zod'

import {
  entitySeoSchema,
  ENTITY_SEO_DEFAULTS,
} from '@/modules/seo/validations/entity-seo.schema'

export const blogSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  excerpt: z.string().max(280, 'Keep it under 280 characters').optional().or(z.literal('')),
  content: z.string().min(20, 'Content is required'),
  featuredImage: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Select a category'),
  readingTime: z.number().int().min(1).optional(),
  isPublished: z.boolean(),
  seo: entitySeoSchema.optional(),
})

export type BlogFormValues = z.infer<typeof blogSchema>

export const BLOG_DEFAULTS: BlogFormValues = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  categoryId: '',
  readingTime: undefined,
  isPublished: false,
  seo: ENTITY_SEO_DEFAULTS,
}
