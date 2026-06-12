import { z } from 'zod'

export const BATCH_STATUS_OPTIONS = [
  { value: 'ENROLLMENT_OPEN', label: 'Enrollment open' },
  { value: 'LIMITED_SEATS', label: 'Limited seats' },
  { value: 'FILLING_FAST', label: 'Filling fast' },
] as const

export const courseBatchSchema = z.object({
  // The course this batch belongs to.
  courseId: z.string().min(1, 'Select a course'),
  // `yyyy-mm-dd` from the date input; coerced to a Date server-side.
  startDate: z.string().min(1, 'Start date is required'),
  duration: z.string().min(1, 'Duration is required'),
  // Delivery mode, e.g. "Instructor Led Training". Optional.
  mode: z.string(),
  // Human-readable schedule, e.g. "Weekdays 9–11 AM". Optional.
  timing: z.string(),
  status: z.enum(['ENROLLMENT_OPEN', 'LIMITED_SEATS', 'FILLING_FAST']),
  isOpen: z.boolean(),
})

export type CourseBatchFormValues = z.infer<typeof courseBatchSchema>

export const COURSE_BATCH_DEFAULTS: CourseBatchFormValues = {
  courseId: '',
  startDate: '',
  duration: '',
  mode: 'Instructor Led Training',
  timing: '',
  status: 'ENROLLMENT_OPEN',
  isOpen: true,
}
