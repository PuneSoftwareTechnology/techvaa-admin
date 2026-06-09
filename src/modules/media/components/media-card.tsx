import { FileIcon, Trash2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatFileSize, fromNow } from '@/lib/format'
import { Button } from '@/components/ui/button'
import type { Media } from '@/types/domain'

export function MediaCard({
  media,
  onDelete,
}: {
  media: Media
  onDelete: () => void
}) {
  const isImage = media.fileType.startsWith('image/')

  return (
    <div className="group relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex aspect-video items-center justify-center bg-muted/50">
        {isImage ? (
          <img
            src={media.url}
            alt={media.originalName}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <FileIcon className="size-10 text-muted-foreground" />
        )}
      </div>
      <div className="space-y-0.5 p-3">
        <p className="truncate text-sm font-medium text-foreground" title={media.originalName}>
          {media.originalName}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(media.fileSize)} · {fromNow(media.createdAt)}
        </p>
      </div>
      <Button
        variant="destructive"
        size="icon-sm"
        onClick={onDelete}
        className={cn(
          'absolute top-2 right-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100',
        )}
        aria-label={`Delete ${media.originalName}`}
      >
        <Trash2Icon className="size-4" />
      </Button>
    </div>
  )
}
