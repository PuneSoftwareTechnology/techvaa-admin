import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Course } from '@/types/domain'
import { courseService } from '../services/course.service'
import type { CourseFormValues } from '../validations/course.schema.ts'

export const courseHooks = createCrudHooks<Course, CourseFormValues, Partial<CourseFormValues>>({
  name: 'Course',
  keys: queryKeys.courses,
  repository: courseService,
})
