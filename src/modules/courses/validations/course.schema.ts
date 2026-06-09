import { z } from 'zod'

import { COURSE_LEVELS } from '@/types/domain'
import {
  entitySeoSchema,
  ENTITY_SEO_DEFAULTS,
} from '@/modules/seo/validations/entity-seo.schema'

export const courseSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  shortDescription: z.string().max(200, 'Keep it under 200 characters').optional().or(z.literal('')),
  description: z.string().min(10, 'Description is required'),
  duration: z.string().optional().or(z.literal('')),
  level: z.enum(COURSE_LEVELS),
  price: z.string().optional().or(z.literal('')),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  seo: entitySeoSchema.optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export const COURSE_DEFAULTS: CourseFormValues = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  duration: '',
  level: 'ALL_LEVELS',
  price: '',
  image: '',
  isFeatured: false,
  isPublished: false,
  seo: ENTITY_SEO_DEFAULTS,
}
