import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Faq } from '@/types/domain'
import type { FaqFormValues } from '../validations/faq.schema'

export const faqRepository = createCrudRepository<
  Faq,
  FaqFormValues,
  Partial<FaqFormValues>
>('faqs', mockDb.faqs)
