import type { ListParams, Paginated } from '@/types/api'

/** Simulate network latency so loading/skeleton states are exercised in dev. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

let counter = 0
/** Collision-resistant-enough id for the in-memory mock store. */
export function mockId(prefix = 'm') {
  counter += 1
  return `${prefix}_${Date.now().toString(36)}${counter.toString(36)}`
}

export function nowIso() {
  return new Date().toISOString()
}

/** Apply search / sort / pagination to an in-memory array, mimicking the API. */
export function applyListParams<T extends Record<string, unknown>>(
  rows: T[],
  params: ListParams | undefined,
  searchFields: (keyof T)[],
): Paginated<T> {
  const {
    page = 1,
    pageSize = 10,
    search,
    sortBy,
    sortOrder = 'desc',
    filters,
  } = params ?? {}

  let result = [...rows]

  if (search?.trim()) {
    const q = search.trim().toLowerCase()
    result = result.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    )
  }

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value === undefined || value === '' || value === 'all') continue
      result = result.filter((row) => String(row[key]) === String(value))
    }
  }

  if (sortBy) {
    result.sort((a, b) => {
      const av = a[sortBy as keyof T]
      const bv = b[sortBy as keyof T]
      if (av == null) return 1
      if (bv == null) return -1
      if (av < bv) return sortOrder === 'asc' ? -1 : 1
      if (av > bv) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }

  const total = result.length
  const start = (page - 1) * pageSize
  const data = result.slice(start, start + pageSize)

  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}
