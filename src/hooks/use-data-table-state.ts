import { useCallback, useMemo, useState } from 'react'

import { PAGINATION } from '@/config/constants'
import type { ListParams, SortOrder } from '@/types/api'
import { useDebouncedValue } from './use-debounced-value'

type FilterValue = string | number | boolean | undefined
type Filters = Record<string, FilterValue>

interface Options {
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  initialFilters?: Filters
}

/**
 * Owns table UI state (page, page size, debounced search, sort, filters) and
 * derives the `ListParams` passed to a list query. Changing search / filters /
 * page size resets to the first page.
 */
export function useDataTableState(options: Options = {}) {
  const [page, setPage] = useState<number>(PAGINATION.defaultPage)
  const [pageSize, setPageSizeState] = useState<number>(
    options.pageSize ?? PAGINATION.defaultPageSize,
  )
  const [search, setSearchState] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)
  const [sortBy, setSortBy] = useState(options.sortBy)
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    options.sortOrder ?? 'desc',
  )
  const [filters, setFilters] = useState<Filters>(options.initialFilters ?? {})

  const setSearch = useCallback((value: string) => {
    setSearchState(value)
    setPage(1)
  }, [])

  const setPageSize = useCallback((value: number) => {
    setPageSizeState(value)
    setPage(1)
  }, [])

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }, [])

  const toggleSort = useCallback(
    (key: string) => {
      if (sortBy === key) {
        setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortBy(key)
        setSortOrder('asc')
      }
      setPage(1)
    },
    [sortBy],
  )

  const params = useMemo<ListParams>(
    () => ({
      page,
      pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy,
      sortOrder,
      filters,
    }),
    [page, pageSize, debouncedSearch, sortBy, sortOrder, filters],
  )

  return {
    params,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    sort: { sortBy, sortOrder },
    toggleSort,
    filters,
    setFilter,
  }
}
