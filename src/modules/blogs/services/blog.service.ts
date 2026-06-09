import { blogRepository } from '../repositories/blog.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const blogService = blogRepository
