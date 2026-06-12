import { z } from 'zod'

export const curriculumSchema = z.object({
  // The course this curriculum item belongs to.
  courseId: z.string().min(1, 'Select a course'),
  heading: z.string().min(2, 'Heading is required'),
  description: z.string().min(2, 'Description is required'),
  sortOrder: z
    .number({ message: 'Enter a number' })
    .int()
    .min(0, 'Must be 0 or greater'),
})

export type CurriculumFormValues = z.infer<typeof curriculumSchema>

export const CURRICULUM_DEFAULTS: CurriculumFormValues = {
  courseId: '',
  heading: '',
  description: '',
  sortOrder: 0,
}
