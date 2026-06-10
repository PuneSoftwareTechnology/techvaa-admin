import { z } from 'zod'

import {
  entitySeoSchema,
  ENTITY_SEO_DEFAULTS,
} from '@/modules/seo/validations/entity-seo.schema'

/** A list of non-empty bullet points (trimmed). */
const bulletList = z.array(z.string().trim().min(1))

export const courseSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().min(3, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: z.string().min(10, 'Description is required'),
  intro: bulletList,
  modules: bulletList,
  prerequisites: bulletList,
  relatedCourseIds: z.array(z.string()),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
  seo: entitySeoSchema.optional(),
})

export type CourseFormValues = z.infer<typeof courseSchema>

export const COURSE_DEFAULTS: CourseFormValues = {
  title: '',
  slug: '',
  description: '',
  intro: [],
  modules: [],
  prerequisites: [],
  relatedCourseIds: [],
  image: '',
  isPublished: false,
  seo: ENTITY_SEO_DEFAULTS,
}
