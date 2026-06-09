/** Generic shapes shared by every repository / service. */

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}

export type SortOrder = 'asc' | 'desc'

/** Query params accepted by list endpoints. */
export interface ListParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: SortOrder
  /** Arbitrary, endpoint-specific filters (status, category, etc). */
  filters?: Record<string, string | number | boolean | undefined>
}

/** Normalised API error surfaced to the UI by the axios layer. */
export interface ApiError {
  message: string
  status?: number
  code?: string
  /** Field-level validation errors keyed by field name. */
  fieldErrors?: Record<string, string>
}
