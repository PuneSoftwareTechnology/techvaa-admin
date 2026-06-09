import { useRef } from 'react'
import { ImageIcon, Loader2Icon, UploadCloudIcon, XIcon } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useImageUpload } from '@/hooks/use-image-upload'
import type { UploadFolder } from '@/lib/upload-folders'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml']

interface ImageUploadProps {
  /** Current image URL. */
  value?: string
  /** Top-level S3 prefix the file is stored under (e.g. "courses", "blogs"). */
  folder: UploadFolder
  /** Slug — groups the upload under `<folder>/<slug>/` in S3. */
  slug: string
  onChange: (url: string) => void
}

/**
 * Reusable image picker: uploads the chosen file to S3 and reports back the
 * public URL via `onChange`. Shared across course / blog (and future) forms.
 */
export function ImageUpload({ value, folder, slug, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const upload = useImageUpload()

  function handleFile(file: File | undefined) {
    if (!file) return
    if (!ACCEPTED.includes(file.type)) {
      toast.error('Unsupported image type (PNG, JPG, WEBP, GIF or SVG).')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image exceeds the 5 MB limit.')
      return
    }
    upload.mutate(
      { file, folder, slug: slug || 'misc' },
      { onSuccess: (url) => onChange(url) },
    )
  }

  return (
    <div className="space-y-2">
      <div
        onClick={() => !upload.isPending && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={cn(
          'group relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40',
          upload.isPending && 'pointer-events-none opacity-70',
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground">
            <ImageIcon className="size-6" />
            <span className="text-xs">No image</span>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {upload.isPending ? (
            <Loader2Icon className="size-5 animate-spin text-white" />
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-medium text-white">
              <UploadCloudIcon className="size-4" />
              {value ? 'Replace image' : 'Upload image'}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <UploadCloudIcon className="size-4" />
          )}
          {value ? 'Replace' : 'Upload'}
        </Button>
        {value && !upload.isPending && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange('')}
          >
            <XIcon className="size-4" />
            Remove
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      <p className="text-xs text-muted-foreground">
        PNG, JPG, WEBP, GIF or SVG · up to 5 MB
      </p>
    </div>
  )
}
