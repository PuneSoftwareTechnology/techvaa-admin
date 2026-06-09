import { QueryClient } from '@tanstack/react-query'

/** Shared TanStack Query client with sensible production defaults. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        const status = (error as { status?: number })?.status
        // Never retry auth/permission/not-found errors.
        if (status && [400, 401, 403, 404, 422].includes(status)) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})
