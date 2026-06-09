import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Course } from '@/types/domain'
import type { CourseFormValues } from '../validations/course.schema.ts'

export const courseRepository = createCrudRepository<
  Course,
  CourseFormValues,
  Partial<CourseFormValues>
>('courses', mockDb.courses)
