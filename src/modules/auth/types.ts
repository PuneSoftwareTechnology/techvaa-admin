import type { User } from '@/types/domain'

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthSession {
  user: User
  /** Access token. With httpOnly-cookie auth this may be empty. */
  token: string
}

export type AuthStatus =
  | 'unknown' // before the first session check resolves
  | 'authenticated'
  | 'unauthenticated'
