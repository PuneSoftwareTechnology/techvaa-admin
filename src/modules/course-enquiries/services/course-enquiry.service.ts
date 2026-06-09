import type { ListParams } from '@/types/api'
import type { CourseEnquiry, LeadStatus } from '@/types/domain'
import { courseEnquiryRepository } from '../repositories/course-enquiry.repository'

export const courseEnquiryService = {
  ...courseEnquiryRepository,
  updateStatus: (id: string, status: LeadStatus) =>
    courseEnquiryRepository.update(id, { status }),
  /** Fetch every enquiry matching the filters (for CSV export). */
  async exportAll(params: ListParams): Promise<CourseEnquiry[]> {
    const result = await courseEnquiryRepository.list({
      ...params,
      page: 1,
      pageSize: 10_000,
    })
    return result.data
  },
}
