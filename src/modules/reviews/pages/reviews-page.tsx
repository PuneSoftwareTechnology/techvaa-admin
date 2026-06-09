import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/data/data-table'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { RowActions } from '@/components/data/row-actions'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { PublishBadge, RatingStars } from '@/components/common/badges'
import { useCrudController } from '@/hooks/use-crud-controller'
import type { Review } from '@/types/domain'
import { reviewHooks } from '../hooks/use-reviews'
import { ReviewForm } from '../components/review-form'
import { REVIEW_DEFAULTS } from '../validations/review.schema'

const FORM_ID = 'review-form'

export default function ReviewsPage() {
  const c = useCrudController<
    Review,
    typeof REVIEW_DEFAULTS,
    Partial<typeof REVIEW_DEFAULTS>
  >(reviewHooks, { sortBy: 'createdAt', sortOrder: 'desc' })

  const columns: DataTableColumn<Review>[] = [
    {
      id: 'student',
      header: 'Student',
      sortKey: 'studentName',
      cell: (r) => (
        <div>
          <p className="font-medium text-foreground">{r.studentName}</p>
          <p className="text-xs text-muted-foreground">
            {[r.designation, r.company].filter(Boolean).join(' · ') || '—'}
          </p>
        </div>
      ),
    },
    {
      id: 'rating',
      header: 'Rating',
      sortKey: 'rating',
      cell: (r) => <RatingStars rating={r.rating} />,
    },
    {
      id: 'review',
      header: 'Review',
      cell: (r) => (
        <p className="line-clamp-2 max-w-md text-muted-foreground">{r.review}</p>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (r) => <PublishBadge published={r.isPublished} />,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Reviews"
        description="Moderate and publish student reviews."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New review
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search reviews…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No reviews yet"
        emptyDescription="Add your first student review."
        actions={(r) => (
          <RowActions onEdit={() => c.openEdit(r)} onDelete={() => c.setDeleteTarget(r)} />
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
        title={c.editing ? 'Edit review' : 'New review'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create review'}
      >
        <ReviewForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  studentName: c.editing.studentName,
                  company: c.editing.company ?? '',
                  designation: c.editing.designation ?? '',
                  rating: c.editing.rating,
                  review: c.editing.review,
                  image: c.editing.image ?? '',
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
        title="Delete this review?"
        description={`The review from ${c.deleteTarget?.studentName} will be removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
