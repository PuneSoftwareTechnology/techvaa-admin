import { testimonialRepository } from '../repositories/testimonial.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const testimonialService = testimonialRepository
