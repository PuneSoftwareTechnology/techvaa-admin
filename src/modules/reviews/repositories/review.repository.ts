import { createCrudRepository } from '@/api/crud-repository'
import { mockDb } from '@/api/mock/db'
import type { Review } from '@/types/domain'
import type { ReviewFormValues } from '../validations/review.schema.ts'

export const reviewRepository = createCrudRepository<
  Review,
  ReviewFormValues,
  Partial<ReviewFormValues>
>('reviews', mockDb.reviews)
