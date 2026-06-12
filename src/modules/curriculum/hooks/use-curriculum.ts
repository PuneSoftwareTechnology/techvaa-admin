import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { CurriculumItem } from '@/types/domain'
import { curriculumService } from '../services/curriculum-item.service'
import type { CurriculumFormValues } from '../validations/curriculum.schema'

export const curriculumHooks = createCrudHooks<
  CurriculumItem,
  CurriculumFormValues,
  Partial<CurriculumFormValues>
>({
  name: 'Curriculum item',
  keys: queryKeys.curriculum,
  repository: curriculumService,
})
