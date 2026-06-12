import { z } from 'zod'

import { requiredRichText } from '@/lib/rich-text'

const optionalText = z.string().optional().or(z.literal(''))
const optionalImage = z.string().url('Enter a valid URL').optional().or(z.literal(''))

export const blogSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  metaDescription: z.string().max(160, 'Keep it under 160 characters').optional().or(z.literal('')),
  featuredImage: optionalImage,
  introduction: requiredRichText(20, 'Introduction is required'),

  // Primary content block
  primaryTitle: optionalText,
  primaryIntro: optionalText,
  primaryText: optionalText,

  // Secondary content block
  secondaryTitle: optionalText,
  secondaryIntro: optionalText,
  secondaryText: optionalText,

  // Tertiary content block
  tertiaryTitle: optionalText,
  tertiaryIntro: optionalText,
  tertiaryText: optionalText,
  tertiaryPoints: z.array(z.string().min(1)),

  conclusion: optionalText,

  relatedCourseIds: z.array(z.string()),
  showOnHomepage: z.boolean(),
  isPublished: z.boolean(),
})

export type BlogFormValues = z.infer<typeof blogSchema>

export const BLOG_DEFAULTS: BlogFormValues = {
  title: '',
  slug: '',
  metaDescription: '',
  featuredImage: '',
  introduction: '',
  primaryTitle: '',
  primaryIntro: '',
  primaryText: '',
  secondaryTitle: '',
  secondaryIntro: '',
  secondaryText: '',
  tertiaryTitle: '',
  tertiaryIntro: '',
  tertiaryText: '',
  tertiaryPoints: [],
  conclusion: '',
  relatedCourseIds: [],
  showOnHomepage: false,
  isPublished: false,
}
