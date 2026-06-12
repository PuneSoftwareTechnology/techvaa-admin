import { z } from 'zod'

export const courseBatchSchema = z.object({
  // The course this batch belongs to.
  courseId: z.string().min(1, 'Select a course'),
  // `yyyy-mm-dd` from the date input; coerced to a Date server-side.
  startDate: z.string().min(1, 'Start date is required'),
  duration: z.string().min(1, 'Duration is required'),
  isOpen: z.boolean(),
  // When true, the batch also appears in the home-page upcoming-batches table.
  showOnHomepage: z.boolean(),
})

export type CourseBatchFormValues = z.infer<typeof courseBatchSchema>

export const COURSE_BATCH_DEFAULTS: CourseBatchFormValues = {
  courseId: '',
  startDate: '',
  duration: '',
  isOpen: true,
  showOnHomepage: false,
}
