import type { ListParams } from '@/types/api'
import type { Lead, LeadStatus } from '@/types/domain'
import { leadRepository } from '../repositories/lead.repository'

export const leadService = {
  ...leadRepository,
  updateStatus: (id: string, status: LeadStatus) =>
    leadRepository.update(id, { status }),
  /** Fetch every lead matching the filters (for CSV export). */
  async exportAll(params: ListParams): Promise<Lead[]> {
    const result = await leadRepository.list({ ...params, page: 1, pageSize: 10_000 })
    return result.data
  },
}
