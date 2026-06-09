import type { ListParams, Paginated } from '@/types/api'
import type { Entity } from '@/types/crud'
import { applyListParams, delay, mockId, nowIso } from './utils'

/**
 * Generic in-memory collection that emulates a REST resource: list (with
 * search / sort / pagination), get, create, update and delete. Backs the
 * mock repositories so the whole admin is runnable without a server.
 */
export class MockCollection<T extends Entity> {
  private rows: T[]
  private readonly idPrefix: string
  private readonly searchFields: (keyof T)[]

  constructor(seed: T[], opts: { idPrefix: string; searchFields: (keyof T)[] }) {
    this.rows = [...seed]
    this.idPrefix = opts.idPrefix
    this.searchFields = opts.searchFields
  }

  async list(params?: ListParams): Promise<Paginated<T>> {
    const result = applyListParams(
      this.rows as unknown as Record<string, unknown>[],
      params,
      this.searchFields as string[],
    )
    return delay(result as unknown as Paginated<T>)
  }

  /** Non-paginated access to every row (used for dashboard aggregates). */
  all(): T[] {
    return [...this.rows]
  }

  async get(id: string): Promise<T> {
    const row = this.rows.find((r) => r.id === id)
    if (!row) return Promise.reject({ message: 'Not found', status: 404 })
    return delay({ ...row }, 150)
  }

  async create(dto: Partial<T>): Promise<T> {
    const row = {
      ...dto,
      id: mockId(this.idPrefix),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    } as T
    this.rows = [row, ...this.rows]
    return delay({ ...row })
  }

  async update(id: string, dto: Partial<T>): Promise<T> {
    const index = this.rows.findIndex((r) => r.id === id)
    if (index === -1) return Promise.reject({ message: 'Not found', status: 404 })
    const updated = { ...this.rows[index], ...dto, id, updatedAt: nowIso() } as T
    this.rows = this.rows.map((r) => (r.id === id ? updated : r))
    return delay({ ...updated })
  }

  async remove(id: string): Promise<void> {
    this.rows = this.rows.filter((r) => r.id !== id)
    await delay(null, 200)
  }
}
