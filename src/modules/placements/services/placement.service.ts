import { placementRepository } from '../repositories/placement.repository'

/** Service layer — delegates pure CRUD to the repository. */
export const placementService = placementRepository
