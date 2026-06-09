import { http } from '@/api/http'
import { env } from '@/config/env'
import { delay, nowIso } from '@/api/mock/utils'
import { mockDb } from '@/api/mock/db'
import type { MockUser } from '@/api/mock/seed-users'
import type { User } from '@/types/domain'
import type { AuthSession, LoginCredentials } from '../types'

/** Strip the mock-only password field before returning a User. */
function toUser(u: MockUser): User {
  const rest = { ...u } as Partial<MockUser>
  delete rest.password
  return rest as User
}

export const authRepository = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (env.useMock) {
      // Read straight from the shared users collection so credentials issued
      // from the Credentials module can immediately sign in.
      const match = mockDb.users
        .all()
        .find(
          (u) =>
            u.email.toLowerCase() === credentials.email.trim().toLowerCase() &&
            u.password === credentials.password,
        )
      if (!match) {
        return Promise.reject({
          message: 'Invalid email or password.',
          status: 401,
        })
      }
      if (!match.isActive) {
        return Promise.reject({
          message: 'This account has been deactivated. Contact an admin.',
          status: 403,
        })
      }
      await mockDb.users.update(match.id, { lastLoginAt: nowIso() })
      return delay({ user: toUser(match), token: `mock.${match.id}.${Date.now()}` })
    }

    const { data } = await http.post<AuthSession>('/auth/login', credentials)
    return data
  },

  async me(): Promise<User> {
    if (env.useMock) {
      return delay(toUser(mockDb.users.all()[0]), 150)
    }
    const { data } = await http.get<User>('/auth/me')
    return data
  },

  async logout(): Promise<void> {
    if (env.useMock) {
      await delay(null, 100)
      return
    }
    await http.post('/auth/logout')
  },
}
