import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ListParams } from '@/types/api'
import type { ApiError } from '@/types/api'
import { usersService } from '../services/users.service'
import type { CreateUserDto, ResetPasswordDto, UpdateUserDto } from '../types'

/** Paginated, searchable list of credentials. */
export function useUsers(params: ListParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersService.list(params),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: CreateUserDto) => usersService.create(dto),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success(`Credential issued for ${user.name}.`)
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Could not issue the credential.')
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) =>
      usersService.update(id, dto),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success(`${user.name}'s access updated.`)
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Could not update the credential.')
    },
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: ResetPasswordDto }) =>
      usersService.resetPassword(id, dto),
    onSuccess: () => {
      toast.success('Password reset. Share the new password securely.')
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Could not reset the password.')
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => usersService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.users.all })
      toast.success('Credential revoked.')
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Could not revoke the credential.')
    },
  })
}
