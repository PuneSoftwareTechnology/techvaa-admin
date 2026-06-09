import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import { seoService } from '../services/seo.service'
import type { SeoEntry } from '../types'

export const seoHooks = createCrudHooks<
  SeoEntry,
  Partial<SeoEntry>,
  Partial<SeoEntry>
>({
  name: 'SEO entry',
  keys: queryKeys.seo,
  repository: seoService,
})
