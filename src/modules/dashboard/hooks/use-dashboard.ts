import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'
import { dashboardService } from '../services/dashboard.service'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats,
    queryFn: () => dashboardService.getStats(),
  })
}

export function useDashboardAnalytics() {
  return useQuery({
    queryKey: queryKeys.dashboard.analytics,
    queryFn: () => dashboardService.getAnalytics(),
  })
}
