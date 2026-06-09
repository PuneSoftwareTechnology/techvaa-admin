import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Faq } from '@/types/domain'
import { faqService } from '../services/faq.service'
import type { FaqFormValues } from '../validations/faq.schema'

export const faqHooks = createCrudHooks<Faq, FaqFormValues, Partial<FaqFormValues>>({
  name: 'FAQ',
  keys: queryKeys.faqs,
  repository: faqService,
})
