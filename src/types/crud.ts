import type { ListParams, Paginated } from './api'

/**
 * The contract every resource repository implements. `T` is the entity,
 * `C` the create DTO and `U` the (partial) update DTO.
 */
export interface CrudRepository<T, C = Partial<T>, U = Partial<T>> {
  list(params?: ListParams): Promise<Paginated<T>>
  get(id: string): Promise<T>
  create(dto: C): Promise<T>
  update(id: string, dto: U): Promise<T>
  remove(id: string): Promise<void>
}

/** Shape shared by every persisted entity. (`updatedAt` is absent on Media.) */
export interface Entity {
  id: string
  createdAt: string
  updatedAt?: string
}
