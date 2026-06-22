import { z } from 'zod'

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message is required'),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
  // Shown in the homepage success-stories section when true.
  showOnHomepage: z.boolean(),
  // Courses this testimonial is attached to (shown on each course's detail page).
  courseIds: z.array(z.string()),
})

export type TestimonialFormValues = z.infer<typeof testimonialSchema>

export const TESTIMONIAL_DEFAULTS: TestimonialFormValues = {
  name: '',
  role: '',
  company: '',
  message: '',
  image: '',
  videoUrl: '',
  isPublished: false,
  showOnHomepage: false,
  courseIds: [],
}
