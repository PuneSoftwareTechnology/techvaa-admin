import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Placement } from '@/types/domain'
import type { PlacementFormValues } from '../validations/placement.schema.ts'

export const placementRepository = createCrudRepository<
  Placement,
  PlacementFormValues,
  Partial<PlacementFormValues>
>('placements', mockDb.placements)
