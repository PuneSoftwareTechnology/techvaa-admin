import { useCallback, useState } from 'react'
import type {
  UseMutationResult,
  UseQueryResult,
} from '@tanstack/react-query'

import type { ApiError, ListParams, Paginated, SortOrder } from '@/types/api'
import type { Entity } from '@/types/crud'
import { useDataTableState } from './use-data-table-state'

/**
 * The hooks object produced by `createCrudHooks`. Queries surface the default
 * `Error`; mutations surface `ApiError` (from their typed `onError`). Mutation
 * context is left open (`any`) because the optimistic delete attaches a
 * rollback snapshot.
 */
export interface CrudHooks<T extends Entity, C, U> {
  useList: (params?: ListParams) => UseQueryResult<Paginated<T>, Error>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useCreate: () => UseMutationResult<T, ApiError, C, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useUpdate: () => UseMutationResult<T, ApiError, { id: string; dto: U }, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useDelete: () => UseMutationResult<void, ApiError, string, any>
}

interface ControllerOptions {
  pageSize?: number
  sortBy?: string
  sortOrder?: SortOrder
  initialFilters?: Record<string, string | number | boolean | undefined>
}

/**
 * Binds table state, the list query and create/edit/delete dialog state for a
 * resource. Each module's page consumes this and supplies only its columns and
 * form, eliminating per-module boilerplate.
 */
export function useCrudController<T extends Entity, C, U>(
  hooks: CrudHooks<T, C, U>,
  options: ControllerOptions = {},
) {
  const table = useDataTableState(options)
  const query = hooks.useList(table.params)
  const createMutation = hooks.useCreate()
  const updateMutation = hooks.useUpdate()
  const deleteMutation = hooks.useDelete()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const openCreate = useCallback(() => {
    setEditing(null)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((row: T) => {
    setEditing(row)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => setFormOpen(false), [])

  /** Create when there is no `editing` record, otherwise update. Resolves on success. */
  const submit = useCallback(
    async (create: C, update: U) => {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, dto: update })
      } else {
        await createMutation.mutateAsync(create)
      }
      setFormOpen(false)
    },
    [editing, createMutation, updateMutation],
  )

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }, [deleteTarget, deleteMutation])

  return {
    table,
    query,
    rows: query.data?.data,
    meta: query.data?.meta,
    // form
    formOpen,
    setFormOpen,
    editing,
    openCreate,
    openEdit,
    closeForm,
    submit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    // delete
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  }
}
