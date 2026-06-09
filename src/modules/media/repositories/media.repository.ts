import { createCrudRepository } from '@/api/crud-repository'
import { http } from '@/api/http'
import { env } from '@/config/env'
import { mockDb } from '@/api/mock/db'
import type { Media } from '@/types/domain'

const base = createCrudRepository<Media, Partial<Media>, Partial<Media>>(
  'media',
  mockDb.media,
)

export const mediaRepository = {
  list: base.list,
  remove: base.remove,
  async upload(file: File): Promise<Media> {
    if (env.useMock) {
      return mockDb.media.create({
        fileName: file.name,
        originalName: file.name,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        url: URL.createObjectURL(file),
        uploadedById: 'usr_admin',
      })
    }
    const form = new FormData()
    form.append('file', file)
    const { data } = await http.post<Media>('/media', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },
}
