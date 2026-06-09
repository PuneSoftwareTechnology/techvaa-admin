import { categoryRepository } from '../repositories/category.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const categoryService = categoryRepository
