import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Blog } from '@/types/domain'
import { blogService } from '../services/blog.service'
import type { BlogFormValues } from '../validations/blog.schema.ts'

export const blogHooks = createCrudHooks<Blog, BlogFormValues, Partial<BlogFormValues>>({
  name: 'Blog',
  keys: queryKeys.blogs,
  repository: blogService,
})
