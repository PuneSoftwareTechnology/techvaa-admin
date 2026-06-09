import type { ListParams } from '@/types/api'
import { usersRepository } from '../repositories/users.repository'
import type { CreateUserDto, ResetPasswordDto, UpdateUserDto } from '../types'

/**
 * Service layer for credential management. A thin pass-through today, but the
 * right home for cross-cutting concerns (audit logging, email invites, etc.).
 */
export const usersService = {
  list: (params?: ListParams) => usersRepository.list(params),
  create: (dto: CreateUserDto) => usersRepository.create(dto),
  update: (id: string, dto: UpdateUserDto) => usersRepository.update(id, dto),
  resetPassword: (id: string, dto: ResetPasswordDto) =>
    usersRepository.resetPassword(id, dto),
  remove: (id: string) => usersRepository.remove(id),
}
