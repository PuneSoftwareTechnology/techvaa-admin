import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { CourseBatch } from '@/types/domain'
import type { CourseBatchFormValues } from '../validations/course-batch.schema'

export const courseBatchRepository = createCrudRepository<
  CourseBatch,
  CourseBatchFormValues,
  Partial<CourseBatchFormValues>
>('course-batches', mockDb.courseBatches)
