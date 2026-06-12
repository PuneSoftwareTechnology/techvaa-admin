import type { ListParams } from '@/types/api'

/**
 * Centralised, type-safe query-key factory. Every module derives its keys
 * from here so cache invalidation stays consistent and discoverable.
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
    analytics: ['dashboard', 'analytics'] as const,
  },
  courses: {
    all: ['courses'] as const,
    list: (params?: ListParams) => ['courses', 'list', params ?? {}] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
  },
  blogs: {
    all: ['blogs'] as const,
    list: (params?: ListParams) => ['blogs', 'list', params ?? {}] as const,
    detail: (id: string) => ['blogs', 'detail', id] as const,
  },
  curriculum: {
    all: ['curriculum'] as const,
    list: (params?: ListParams) => ['curriculum', 'list', params ?? {}] as const,
    detail: (id: string) => ['curriculum', 'detail', id] as const,
  },
  courseBatches: {
    all: ['courseBatches'] as const,
    list: (params?: ListParams) =>
      ['courseBatches', 'list', params ?? {}] as const,
    detail: (id: string) => ['courseBatches', 'detail', id] as const,
  },
  reviews: {
    all: ['reviews'] as const,
    list: (params?: ListParams) => ['reviews', 'list', params ?? {}] as const,
    detail: (id: string) => ['reviews', 'detail', id] as const,
  },
  placements: {
    all: ['placements'] as const,
    list: (params?: ListParams) => ['placements', 'list', params ?? {}] as const,
    detail: (id: string) => ['placements', 'detail', id] as const,
  },
  faqs: {
    all: ['faqs'] as const,
    list: (params?: ListParams) => ['faqs', 'list', params ?? {}] as const,
    detail: (id: string) => ['faqs', 'detail', id] as const,
  },
  leads: {
    all: ['leads'] as const,
    list: (params?: ListParams) => ['leads', 'list', params ?? {}] as const,
    detail: (id: string) => ['leads', 'detail', id] as const,
  },
  courseEnquiries: {
    all: ['courseEnquiries'] as const,
    list: (params?: ListParams) =>
      ['courseEnquiries', 'list', params ?? {}] as const,
    detail: (id: string) => ['courseEnquiries', 'detail', id] as const,
  },
  media: {
    all: ['media'] as const,
    list: (params?: ListParams) => ['media', 'list', params ?? {}] as const,
  },
  users: {
    all: ['users'] as const,
    list: (params?: ListParams) => ['users', 'list', params ?? {}] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
  seo: {
    all: ['seo'] as const,
    list: (params?: ListParams) => ['seo', 'list', params ?? {}] as const,
    detail: (id: string) => ['seo', 'detail', id] as const,
  },
} as const
