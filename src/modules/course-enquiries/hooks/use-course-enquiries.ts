import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/types/api'
import type { CourseEnquiry, LeadStatus } from '@/types/domain'
import { courseEnquiryService } from '../services/course-enquiry.service'

export const courseEnquiryHooks = createCrudHooks<
  CourseEnquiry,
  Partial<CourseEnquiry>,
  Partial<CourseEnquiry>
>({
  name: 'Course enquiry',
  keys: queryKeys.courseEnquiries,
  repository: courseEnquiryService,
})

/** Dedicated status-update mutation used by the inline status selector. */
export function useUpdateCourseEnquiryStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      courseEnquiryService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.courseEnquiries.all })
      toast.success('Enquiry status updated')
    },
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Failed to update status'),
  })
}
