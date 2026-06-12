import { courseBatchRepository } from '../repositories/course-batch.repository'

/**
 * Service layer. Pure CRUD delegates to the repository; module-specific rules
 * (when they arise) belong here, not in hooks or components.
 */
export const courseBatchService = courseBatchRepository
