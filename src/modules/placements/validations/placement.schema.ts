import { z } from 'zod'

export const placementSchema = z.object({
  studentName: z.string().min(2, 'Name is required'),
  company: z.string().min(1, 'Company is required'),
  package: z.string().optional().or(z.literal('')),
  course: z.string().optional().or(z.literal('')),
  image: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  joiningDate: z.string().optional().or(z.literal('')),
  isPublished: z.boolean(),
  // Show in the "Recently Placed Students" section of the selected course pages.
  showOnCoursePage: z.boolean(),
  courseIds: z.array(z.string()),
}).refine((v) => !v.showOnCoursePage || v.courseIds.length > 0, {
  path: ['courseIds'],
  message: 'Pick at least one course page, or turn “Show on course page” off',
})

export type PlacementFormValues = z.infer<typeof placementSchema>

export const PLACEMENT_DEFAULTS: PlacementFormValues = {
  studentName: '',
  company: '',
  package: '',
  course: '',
  image: '',
  linkedinUrl: '',
  joiningDate: '',
  isPublished: false,
  showOnCoursePage: false,
  courseIds: [],
}
