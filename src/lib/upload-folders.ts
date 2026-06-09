/**
 * Top-level S3 prefixes media can be uploaded under. Objects are stored at
 * `<folder>/<slug>/<file>` in the `techvaa` bucket (publicly readable).
 *
 * Shared by the client upload component and the server route so both agree on
 * which prefixes are allowed — keep this list as the single source of truth.
 */
export const UPLOAD_FOLDERS = ['courses', 'blogs'] as const

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number]

export function isUploadFolder(value: unknown): value is UploadFolder {
  return (
    typeof value === 'string' &&
    (UPLOAD_FOLDERS as readonly string[]).includes(value)
  )
}
