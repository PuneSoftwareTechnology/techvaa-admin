import { courseRepository } from '../repositories/course.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const courseService = courseRepository
