import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { CourseEnquiry } from '@/types/domain'

/**
 * Course enquiries are created by the public website's "Enroll Now" dialog; the
 * admin triages (updates status) and removes them.
 */
export const courseEnquiryRepository = createCrudRepository<
  CourseEnquiry,
  Partial<CourseEnquiry>,
  Partial<CourseEnquiry>
>('course-enquiries', mockDb.courseEnquiries)
