import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { uploadImage } from '@/api/upload'
import type { ApiError } from '@/types/api'
import type { UploadFolder } from '@/lib/upload-folders'

/** Uploads an image to S3 and resolves to its public URL. */
export function useImageUpload() {
  return useMutation({
    mutationFn: ({
      file,
      folder,
      slug,
    }: {
      file: File
      folder: UploadFolder
      slug: string
    }) => uploadImage(folder, file, slug),
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Image upload failed'),
  })
}
