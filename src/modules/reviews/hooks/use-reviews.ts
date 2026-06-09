import { createCrudHooks } from '@/hooks/create-crud-hooks'
import { queryKeys } from '@/lib/query-keys'
import type { Review } from '@/types/domain'
import { reviewService } from '../services/review.service'
import type { ReviewFormValues } from '../validations/review.schema.ts'

export const reviewHooks = createCrudHooks<Review, ReviewFormValues, Partial<ReviewFormValues>>({
  name: 'Review',
  keys: queryKeys.reviews,
  repository: reviewService,
})
