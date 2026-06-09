import { z } from 'zod'

export const reviewSchema = z.object({
  studentName: z.string().min(2, 'Name is required'),
  company: z.string().optional().or(z.literal('')),
  designation: z.string().optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Rating is required').max(5),
  review: z.string().min(10, 'Review is required'),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  isPublished: z.boolean(),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export const REVIEW_DEFAULTS: ReviewFormValues = {
  studentName: '',
  company: '',
  designation: '',
  rating: 5,
  review: '',
  image: '',
  isPublished: false,
}
