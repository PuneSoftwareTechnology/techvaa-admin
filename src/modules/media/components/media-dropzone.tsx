import { useRef, useState, type DragEvent } from 'react'
import { Loader2Icon, UploadCloudIcon } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { useUploadMedia } from '../hooks/use-media'
import { validateFile } from '../validations/upload'

export function MediaDropzone() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const upload = useUploadMedia()

  function handleFiles(files: FileList | null) {
    if (!files?.length) return
    const valid: File[] = []
    for (const file of Array.from(files)) {
      const error = validateFile(file)
      if (error) toast.error(error)
      else valid.push(file)
    }
    if (!valid.length) return
    Promise.all(valid.map((f) => upload.mutateAsync(f)))
      .then(() => toast.success(`Uploaded ${valid.length} file(s)`))
      .catch(() => {})
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card px-6 py-10 text-center transition-colors hover:border-primary/40 hover:bg-muted/40',
        dragging && 'border-primary bg-primary/5',
      )}
    >
      <span className="grid size-11 place-items-center rounded-full bg-muted text-muted-foreground">
        {upload.isPending ? (
          <Loader2Icon className="size-5 animate-spin" />
        ) : (
          <UploadCloudIcon className="size-5" />
        )}
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">
          {upload.isPending ? 'Uploading…' : 'Drag & drop files, or click to browse'}
        </p>
        <p className="text-xs text-muted-foreground">
          PNG, JPG, WEBP, GIF, SVG or PDF · up to 5 MB
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*,application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
