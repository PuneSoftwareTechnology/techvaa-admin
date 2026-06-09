import { authRepository } from '../repositories/auth.repository'
import type { LoginCredentials } from '../types'

/**
 * Service layer for auth. Today it is a thin pass-through to the repository,
 * but it is the right home for cross-cutting concerns (analytics, token
 * refresh orchestration, etc.) without leaking them into hooks or the store.
 */
export const authService = {
  login: (credentials: LoginCredentials) => authRepository.login(credentials),
  me: () => authRepository.me(),
  logout: () => authRepository.logout(),
}
