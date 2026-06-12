import { z } from 'zod'

export const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message is required'),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  videoUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
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
}
