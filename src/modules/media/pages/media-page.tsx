import { useState } from 'react'

import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { useDataTableState } from '@/hooks/use-data-table-state'
import { ImagesIcon } from 'lucide-react'
import type { Media } from '@/types/domain'
import { useMediaList, useDeleteMedia } from '../hooks/use-media'
import { MediaDropzone } from '../components/media-dropzone'
import { MediaCard } from '../components/media-card'

export default function MediaPage() {
  const table = useDataTableState({ pageSize: 12, sortBy: 'createdAt', sortOrder: 'desc' })
  const { data, isLoading } = useMediaList(table.params)
  const deleteMedia = useDeleteMedia()
  const [target, setTarget] = useState<Media | null>(null)

  return (
    <div className="space-y-5">
      <PageHeader
        title="Media Library"
        description="Upload and manage images and documents."
      />

      <MediaDropzone />

      <DataTableToolbar
        search={table.search}
        onSearchChange={table.setSearch}
        searchPlaceholder="Search files…"
      />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.data.map((m) => (
            <MediaCard key={m.id} media={m} onDelete={() => setTarget(m)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ImagesIcon}
          title="No media yet"
          description="Upload your first file using the dropzone above."
        />
      )}

      <DataTablePagination
        meta={data?.meta}
        pageSize={table.pageSize}
        onPageChange={table.setPage}
        onPageSizeChange={table.setPageSize}
      />

      <ConfirmDialog
        open={!!target}
        onOpenChange={(o) => !o && setTarget(null)}
        title="Delete this file?"
        description={`"${target?.originalName}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleteMedia.isPending}
        onConfirm={() =>
          target &&
          deleteMedia.mutate(target.id, { onSuccess: () => setTarget(null) })
        }
      />
    </div>
  )
}
