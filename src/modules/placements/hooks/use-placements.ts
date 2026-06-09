import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Placement } from '@/types/domain'
import { placementService } from '../services/placement.service'
import type { PlacementFormValues } from '../validations/placement.schema.ts'

export const placementHooks = createCrudHooks<Placement, PlacementFormValues, Partial<PlacementFormValues>>({
  name: 'Placement',
  keys: queryKeys.placements,
  repository: placementService,
})
