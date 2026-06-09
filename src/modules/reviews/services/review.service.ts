import { reviewRepository } from '../repositories/review.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const reviewService = reviewRepository
