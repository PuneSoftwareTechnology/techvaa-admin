import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Blog } from '@/types/domain'
import type { BlogFormValues } from '../validations/blog.schema.ts'

export const blogRepository = createCrudRepository<
  Blog,
  BlogFormValues,
  Partial<BlogFormValues>
>('blogs', mockDb.blogs)
