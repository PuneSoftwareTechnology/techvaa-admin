import { z } from 'zod'

import { requiredRichText } from '@/lib/rich-text'

export const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: requiredRichText(5, 'Answer must be at least 5 characters'),
  sortOrder: z
    .number({ message: 'Enter a number' })
    .int()
    .min(0, 'Must be 0 or greater'),
  isPublished: z.boolean(),
  // Shown in the homepage FAQ section when true.
  showOnHomepage: z.boolean(),
  // Courses this FAQ is attached to (shown on each course's detail page).
  courseIds: z.array(z.string()),
})

export type FaqFormValues = z.infer<typeof faqSchema>

export const FAQ_DEFAULTS: FaqFormValues = {
  question: '',
  answer: '',
  sortOrder: 0,
  isPublished: true,
  showOnHomepage: false,
  courseIds: [],
}
