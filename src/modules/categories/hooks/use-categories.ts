import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { BlogCategory } from '@/types/domain'
import { categoryService } from '../services/category.service'
import type { CategoryFormValues } from '../validations/category.schema.ts'

export const categoryHooks = createCrudHooks<BlogCategory, CategoryFormValues, Partial<CategoryFormValues>>({
  name: 'Category',
  keys: queryKeys.categories,
  repository: categoryService,
})
