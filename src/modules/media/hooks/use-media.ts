import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { queryKeys } from '@/lib/query-keys'
import type { ApiError, ListParams } from '@/types/api'
import { mediaService } from '../services/media.service'

export function useMediaList(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.media.list(params),
    queryFn: () => mediaService.list(params),
  })
}

export function useUploadMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => mediaService.upload(file),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.media.all }),
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Upload failed'),
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mediaService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.media.all })
      toast.success('File deleted')
    },
    onError: (error: ApiError) =>
      toast.error(error.message ?? 'Delete failed'),
  })
}
