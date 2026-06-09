import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { toast } from 'sonner'

import type { ApiError, ListParams, Paginated } from '@/types/api'
import type { CrudRepository, Entity } from '@/types/crud'

interface CrudKeys {
  all: QueryKey
  list: (params?: ListParams) => QueryKey
  detail: (id: string) => QueryKey
}

interface CrudHooksConfig<T extends Entity, C, U> {
  /** Singular, human label used in toasts, e.g. "Course". */
  name: string
  keys: CrudKeys
  repository: CrudRepository<T, C, U>
}

/**
 * Generates the standard TanStack Query hooks for a resource: list, detail,
 * create, update and delete — with toasts, cache invalidation and optimistic
 * deletes. Modules compose these and add only their domain-specific extras.
 */
export function createCrudHooks<T extends Entity, C, U>({
  name,
  keys,
  repository,
}: CrudHooksConfig<T, C, U>) {
  function useList(params?: ListParams) {
    return useQuery({
      queryKey: keys.list(params),
      queryFn: () => repository.list(params),
      placeholderData: keepPreviousData,
    })
  }

  function useDetail(id: string | undefined) {
    return useQuery({
      queryKey: keys.detail(id ?? 'new'),
      queryFn: () => repository.get(id as string),
      enabled: !!id,
    })
  }

  function useCreate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (dto: C) => repository.create(dto),
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: keys.all })
        toast.success(`${name} created`)
      },
      onError: (error: ApiError) =>
        toast.error(error.message ?? `Failed to create ${name.toLowerCase()}`),
    })
  }

  function useUpdate() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: ({ id, dto }: { id: string; dto: U }) =>
        repository.update(id, dto),
      onSuccess: (updated) => {
        qc.invalidateQueries({ queryKey: keys.all })
        qc.setQueryData(keys.detail(updated.id), updated)
        toast.success(`${name} updated`)
      },
      onError: (error: ApiError) =>
        toast.error(error.message ?? `Failed to update ${name.toLowerCase()}`),
    })
  }

  function useDelete() {
    const qc = useQueryClient()
    return useMutation({
      mutationFn: (id: string) => repository.remove(id),
      // Optimistically drop the row from every cached list page.
      onMutate: async (id) => {
        await qc.cancelQueries({ queryKey: keys.all })
        const snapshots = qc.getQueriesData<Paginated<T>>({ queryKey: keys.all })
        for (const [key, page] of snapshots) {
          if (!page?.data) continue
          qc.setQueryData<Paginated<T>>(key, {
            ...page,
            data: page.data.filter((row) => row.id !== id),
            meta: { ...page.meta, total: Math.max(0, page.meta.total - 1) },
          })
        }
        return { snapshots }
      },
      onError: (error: ApiError, _id, context) => {
        context?.snapshots.forEach(([key, page]) => qc.setQueryData(key, page))
        toast.error(error.message ?? `Failed to delete ${name.toLowerCase()}`)
      },
      onSuccess: () => toast.success(`${name} deleted`),
      onSettled: () => qc.invalidateQueries({ queryKey: keys.all }),
    })
  }

  return { useList, useDetail, useCreate, useUpdate, useDelete }
}
