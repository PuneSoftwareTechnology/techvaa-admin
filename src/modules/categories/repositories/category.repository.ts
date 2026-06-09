import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { BlogCategory } from '@/types/domain'
import type { CategoryFormValues } from '../validations/category.schema.ts'

export const categoryRepository = createCrudRepository<
  BlogCategory,
  CategoryFormValues,
  Partial<CategoryFormValues>
>('categories', mockDb.categories)
