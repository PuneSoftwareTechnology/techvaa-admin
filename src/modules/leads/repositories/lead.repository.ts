import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Lead } from '@/types/domain'

/** Leads are created by the public website; the admin updates/removes them. */
export const leadRepository = createCrudRepository<
  Lead,
  Partial<Lead>,
  Partial<Lead>
>('leads', mockDb.leads)
