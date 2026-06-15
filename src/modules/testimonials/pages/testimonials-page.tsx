import { PlusIcon, VideoIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { RefreshButton } from '@/components/common/refresh-button'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/data/data-table'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { RowActions } from '@/components/data/row-actions'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { PublishBadge } from '@/components/common/badges'
import { useCrudController } from '@/hooks/use-crud-controller'
import type { Testimonial } from '@/types/domain'
import { testimonialHooks } from '../hooks/use-testimonials'
import { TestimonialForm } from '../components/testimonial-form'
import { TESTIMONIAL_DEFAULTS } from '../validations/testimonial.schema'

const FORM_ID = 'testimonial-form'

export default function TestimonialsPage() {
  const c = useCrudController<
    Testimonial,
    typeof TESTIMONIAL_DEFAULTS,
    Partial<typeof TESTIMONIAL_DEFAULTS>
  >(testimonialHooks, { sortBy: 'createdAt', sortOrder: 'desc' })

  const columns: DataTableColumn<Testimonial>[] = [
    {
      id: 'person',
      header: 'Person',
      sortKey: 'name',
      cell: (t) => (
        <div>
          <p className="font-medium text-foreground">{t.name}</p>
          <p className="text-xs text-muted-foreground">
            {[t.role, t.company].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
      ),
    },
    {
      id: 'message',
      header: 'Message',
      cell: (t) => (
        <p className="line-clamp-2 max-w-md text-muted-foreground">{t.message}</p>
      ),
    },
    {
      id: 'video',
      header: 'Video',
      cell: (t) =>
        t.videoUrl ? (
          <a
            href={t.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            <VideoIcon className="size-4" />
            Watch
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (t) => <PublishBadge published={t.isPublished} />,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Testimonials"
        description="Curate featured success stories shown on the homepage."
        actions={
          <>
            <RefreshButton onClick={c.refresh} loading={c.isFetching} />
            <Button onClick={c.openCreate}>
              <PlusIcon />
              New testimonial
            </Button>
          </>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search testimonials…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No testimonials yet"
        emptyDescription="Add your first featured testimonial."
        actions={(t) => (
          <RowActions onEdit={() => c.openEdit(t)} onDelete={() => c.setDeleteTarget(t)} />
        )}
      />

      <DataTablePagination
        meta={c.meta}
        pageSize={c.table.pageSize}
        onPageChange={c.table.setPage}
        onPageSizeChange={c.table.setPageSize}
      />

      <FormDialog
        open={c.formOpen}
        onOpenChange={c.setFormOpen}
        title={c.editing ? 'Edit testimonial' : 'New testimonial'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create testimonial'}
      >
        <TestimonialForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  name: c.editing.name,
                  role: c.editing.role ?? '',
                  company: c.editing.company ?? '',
                  message: c.editing.message,
                  image: c.editing.image ?? '',
                  videoUrl: c.editing.videoUrl ?? '',
                  isPublished: c.editing.isPublished,
                }
              : undefined
          }
          onSubmit={(values) => c.submit(values, values)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this testimonial?"
        description={`The testimonial from ${c.deleteTarget?.name} will be removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
