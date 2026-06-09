import { http } from '@/api/http'
import { env } from '@/config/env'
import type { UploadFolder } from '@/lib/upload-folders'

/**
 * Upload an image to S3 (via `POST /api/uploads`) and return its public URL.
 * `folder` selects the top-level S3 prefix (e.g. "courses", "blogs") and
 * `slug` groups objects under `<folder>/<slug>/`. In mock mode we just hand
 * back a local object URL so the UI works without a backend.
 */
export async function uploadImage(
  folder: UploadFolder,
  file: File,
  slug: string,
): Promise<string> {
  if (env.useMock) return URL.createObjectURL(file)

  const form = new FormData()
  form.append('file', file)
  form.append('folder', folder)
  form.append('slug', slug)
  const { data } = await http.post<{ url: string }>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}
