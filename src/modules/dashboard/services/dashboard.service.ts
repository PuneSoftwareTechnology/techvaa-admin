import { dashboardRepository } from '../repositories/dashboard.repository'

export const dashboardService = {
  getStats: () => dashboardRepository.getStats(),
  getAnalytics: () => dashboardRepository.getAnalytics(),
}
