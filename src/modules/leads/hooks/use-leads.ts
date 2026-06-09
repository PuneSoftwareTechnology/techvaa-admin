import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/types/api'
import type { Lead, LeadStatus } from '@/types/domain'
import { leadService } from '../services/lead.service'

export const leadHooks = createCrudHooks<Lead, Partial<Lead>, Partial<Lead>>({
  name: 'Lead',
  keys: queryKeys.leads,
  repository: leadService,
})

/** Dedicated status-update mutation used by the inline status selector. */
export function useUpdateLeadStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      leadService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.leads.all })
      toast.success('Lead status updated')
    },
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Failed to update status'),
  })
}
