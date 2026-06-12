import { z } from 'zod'

import { optionalRichText, requiredRichText } from '@/lib/rich-text'
import {
  entitySeoSchema,
  ENTITY_SEO_DEFAULTS,
} from '@/modules/seo/validations/entity-seo.schema'

export const courseSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  shortDescription: optionalRichText(),
  description: requiredRichText(10, 'Description is required'),
  duration: z.string().optional().or(z.literal('')),
  relatedCourseIds: z.array(z.string()),
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
  relatedCourseIds: [],
  image: '',
  isFeatured: false,
  isPublished: false,
  seo: ENTITY_SEO_DEFAULTS,
}
