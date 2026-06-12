import { curriculumRepository } from '../repositories/curriculum-item.repository'

/**
 * Service layer. Pure CRUD delegates to the repository; module-specific rules
 * (when they arise) belong here, not in hooks or components.
 */
export const curriculumService = curriculumRepository
