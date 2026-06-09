import { http } from '@/api/http'
import { env } from '@/config/env'
import type { ListParams, Paginated } from '@/types/api'
import type { CrudRepository, Entity } from '@/types/crud'
import type { MockCollection } from '@/api/mock/collection'

/**
 * Builds a resource repository wired to either the REST API (axios) or the
 * in-memory mock collection, selected by `VITE_USE_MOCK`. This is the single
 * seam where the data source is swapped — modules never branch on the mode.
 */
export function createCrudRepository<T extends Entity, C = Partial<T>, U = Partial<T>>(
  resource: string,
  mock: MockCollection<T>,
): CrudRepository<T, C, U> {
  const path = `/${resource}`

  return {
    async list(params?: ListParams) {
      if (env.useMock) return mock.list(params)
      const { data } = await http.get<Paginated<T>>(path, {
        params: { ...params, ...params?.filters },
      })
      return data
    },
    async get(id: string) {
      if (env.useMock) return mock.get(id)
      const { data } = await http.get<T>(`${path}/${id}`)
      return data
    },
    async create(dto: C) {
      if (env.useMock) return mock.create(dto as Partial<T>)
      const { data } = await http.post<T>(path, dto)
      return data
    },
    async update(id: string, dto: U) {
      if (env.useMock) return mock.update(id, dto as Partial<T>)
      const { data } = await http.patch<T>(`${path}/${id}`, dto)
      return data
    },
    async remove(id: string) {
      if (env.useMock) return mock.remove(id)
      await http.delete(`${path}/${id}`)
    },
  }
}
