import { faqRepository } from '../repositories/faq.repository'

/**
 * Service layer. For pure CRUD it delegates to the repository; module-specific
 * business rules (when they arise) belong here, not in hooks or components.
 */
export const faqService = faqRepository
