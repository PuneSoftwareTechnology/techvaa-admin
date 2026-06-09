import type { Permission, UserRole } from '@/types/domain'

/** Payload to issue a new credential. */
export interface CreateUserDto {
  name: string
  email: string
  password: string
  role: UserRole
  permissions: Permission[]
  isActive: boolean
}

/** Editable fields of an existing credential. Email is immutable. */
export interface UpdateUserDto {
  name?: string
  role?: UserRole
  permissions?: Permission[]
  isActive?: boolean
}

/** Admin-driven password reset. */
export interface ResetPasswordDto {
  password: string
}
