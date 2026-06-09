/** Client-side upload constraints. */
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
export const ACCEPTED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf',
]

export function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `${file.name}: unsupported file type`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `${file.name}: exceeds 5 MB limit`
  }
  return null
}
