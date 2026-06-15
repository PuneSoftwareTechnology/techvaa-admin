import { useMemo } from 'react'
import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { RefreshButton } from '@/components/common/refresh-button'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable, type DataTableColumn } from '@/components/data/data-table'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { RowActions } from '@/components/data/row-actions'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { formatDate } from '@/lib/format'
import { useCrudController } from '@/hooks/use-crud-controller'
import { courseHooks } from '@/modules/courses/hooks/use-courses'
import type { BatchStatus, CourseBatch } from '@/types/domain'
import { courseBatchHooks } from '../hooks/use-course-batches'
import { CourseBatchForm } from '../components/course-batch-form'
import { COURSE_BATCH_DEFAULTS } from '../validations/course-batch.schema'

const FORM_ID = 'course-batch-form'

const STATUS_LABEL: Record<BatchStatus, string> = {
  ENROLLMENT_OPEN: 'Enrollment open',
  LIMITED_SEATS: 'Limited seats',
  FILLING_FAST: 'Filling fast',
}

const STATUS_VARIANT: Record<BatchStatus, 'success' | 'warning' | 'outline'> = {
  ENROLLMENT_OPEN: 'success',
  LIMITED_SEATS: 'warning',
  FILLING_FAST: 'outline',
}

export default function CourseBatchesPage() {
  const c = useCrudController<
    CourseBatch,
    typeof COURSE_BATCH_DEFAULTS,
    Partial<typeof COURSE_BATCH_DEFAULTS>
  >(courseBatchHooks, { sortBy: 'startDate', sortOrder: 'asc' })

  // Resolve a course title for each row (the mock list returns only courseId).
  const { data: courses } = courseHooks.useList({ pageSize: 100 })
  const courseTitle = useMemo(() => {
    const map = new Map<string, string>()
    for (const course of courses?.data ?? []) map.set(course.id, course.title)
    return (batch: CourseBatch) =>
      batch.course?.title ?? map.get(batch.courseId) ?? '—'
  }, [courses])

  const columns: DataTableColumn<CourseBatch>[] = [
    {
      id: 'course',
      header: 'Course',
      cell: (b) => (
        <span className="font-medium text-foreground">{courseTitle(b)}</span>
      ),
    },
    {
      id: 'startDate',
      header: 'Starts',
      sortKey: 'startDate',
      cell: (b) => formatDate(b.startDate),
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (b) => <span className="text-muted-foreground">{b.duration}</span>,
    },
    {
      id: 'timing',
      header: 'Timing',
      cell: (b) => (
        <span className="text-muted-foreground">{b.timing ?? '—'}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (b) => (
        <Badge variant={STATUS_VARIANT[b.status]}>
          {STATUS_LABEL[b.status]}
        </Badge>
      ),
    },
    {
      id: 'enrolment',
      header: 'Enrolment',
      cell: (b) => (
        <Badge variant={b.isOpen ? 'success' : 'ghost'}>
          {b.isOpen ? 'Open' : 'Closed'}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Batch Schedule"
        description="Manage upcoming batches, their schedule, delivery mode and enrolment status."
        actions={
          <>
            <RefreshButton onClick={c.refresh} loading={c.isFetching} />
            <Button onClick={c.openCreate}>
              <PlusIcon />
              New batch
            </Button>
          </>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search batches…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No batches yet"
        emptyDescription="Schedule the first upcoming batch and link it to a course."
        emptyAction={
          <Button size="sm" onClick={c.openCreate}>
            <PlusIcon />
            New batch
          </Button>
        }
        actions={(b) => (
          <RowActions onEdit={() => c.openEdit(b)} onDelete={() => c.setDeleteTarget(b)} />
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
        title={c.editing ? 'Edit batch' : 'New batch'}
        description="An upcoming batch, attached to a course."
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create batch'}
      >
        <CourseBatchForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  courseId: c.editing.courseId,
                  startDate: c.editing.startDate.slice(0, 10),
                  duration: c.editing.duration,
                  mode: c.editing.mode ?? '',
                  timing: c.editing.timing ?? '',
                  status: c.editing.status,
                  isOpen: c.editing.isOpen,
                }
              : COURSE_BATCH_DEFAULTS
          }
          onSubmit={(values) => c.submit(values, values)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this batch?"
        description={
          c.deleteTarget
            ? `${courseTitle(c.deleteTarget)} — ${formatDate(c.deleteTarget.startDate)}`
            : undefined
        }
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
