import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { CurriculumItem } from '@/types/domain'
import type { CurriculumFormValues } from '../validations/curriculum.schema'

export const curriculumRepository = createCrudRepository<
  CurriculumItem,
  CurriculumFormValues,
  Partial<CurriculumFormValues>
>('curriculum-items', mockDb.curriculumItems)
