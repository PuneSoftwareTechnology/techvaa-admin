import { http } from '@/api/http'
import { env } from '@/config/env'
import { mockDb } from '@/api/mock/db'
import type { MockUser } from '@/api/mock/seed-users'
import type { ListParams, Paginated } from '@/types/api'
import type { User } from '@/types/domain'
import type { CreateUserDto, ResetPasswordDto, UpdateUserDto } from '../types'

const path = '/users'

/** Never let the mock-only password field leak past the repository boundary. */
function toUser(u: MockUser): User {
  const rest = { ...u } as Partial<MockUser>
  delete rest.password
  return rest as User
}

export const usersRepository = {
  async list(params?: ListParams): Promise<Paginated<User>> {
    if (env.useMock) {
      const page = await mockDb.users.list(params)
      return { ...page, data: page.data.map(toUser) }
    }
    const { data } = await http.get<Paginated<User>>(path, {
      params: { ...params, ...params?.filters },
    })
    return data
  },

  async create(dto: CreateUserDto): Promise<User> {
    if (env.useMock) {
      const exists = mockDb.users
        .all()
        .some((u) => u.email.toLowerCase() === dto.email.trim().toLowerCase())
      if (exists) {
        return Promise.reject({
          message: 'A credential with this email already exists.',
          status: 409,
        })
      }
      const created = await mockDb.users.create({
        ...dto,
        email: dto.email.trim().toLowerCase(),
        lastLoginAt: null,
      })
      return toUser(created)
    }
    const { data } = await http.post<User>(path, dto)
    return data
  },

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    if (env.useMock) {
      const updated = await mockDb.users.update(id, dto)
      return toUser(updated)
    }
    const { data } = await http.patch<User>(`${path}/${id}`, dto)
    return data
  },

  async resetPassword(id: string, dto: ResetPasswordDto): Promise<void> {
    if (env.useMock) {
      await mockDb.users.update(id, { password: dto.password })
      return
    }
    await http.post(`${path}/${id}/reset-password`, dto)
  },

  async remove(id: string): Promise<void> {
    if (env.useMock) {
      await mockDb.users.remove(id)
      return
    }
    await http.delete(`${path}/${id}`)
  },
}
