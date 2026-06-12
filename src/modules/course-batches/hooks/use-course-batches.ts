import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { CourseBatch } from '@/types/domain'
import { courseBatchService } from '../services/course-batch.service'
import type { CourseBatchFormValues } from '../validations/course-batch.schema'

export const courseBatchHooks = createCrudHooks<
  CourseBatch,
  CourseBatchFormValues,
  Partial<CourseBatchFormValues>
>({
  name: 'Batch',
  keys: queryKeys.courseBatches,
  repository: courseBatchService,
})
