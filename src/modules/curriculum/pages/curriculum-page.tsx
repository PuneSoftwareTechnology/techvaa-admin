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
import { useCrudController } from '@/hooks/use-crud-controller'
import { courseHooks } from '@/modules/courses/hooks/use-courses'
import type { CurriculumItem } from '@/types/domain'
import { curriculumHooks } from '../hooks/use-curriculum'
import { CurriculumForm } from '../components/curriculum-form'
import { CURRICULUM_DEFAULTS } from '../validations/curriculum.schema'

const FORM_ID = 'curriculum-form'

export default function CurriculumPage() {
  const c = useCrudController<
    CurriculumItem,
    typeof CURRICULUM_DEFAULTS,
    Partial<typeof CURRICULUM_DEFAULTS>
  >(curriculumHooks, { sortBy: 'sortOrder', sortOrder: 'asc' })

  // Resolve a course title for each row (the mock list returns only courseId).
  const { data: courses } = courseHooks.useList({ pageSize: 100 })
  const courseTitle = useMemo(() => {
    const map = new Map<string, string>()
    for (const course of courses?.data ?? []) map.set(course.id, course.title)
    return (item: CurriculumItem) =>
      item.course?.title ?? map.get(item.courseId) ?? '—'
  }, [courses])

  const columns: DataTableColumn<CurriculumItem>[] = [
    {
      id: 'sortOrder',
      header: '#',
      sortKey: 'sortOrder',
      className: 'w-12 text-muted-foreground',
      cell: (i) => i.sortOrder,
    },
    {
      id: 'heading',
      header: 'Heading',
      sortKey: 'heading',
      cell: (i) => (
        <div className="max-w-xl">
          <p className="font-medium text-foreground">{i.heading}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{i.description}</p>
        </div>
      ),
    },
    {
      id: 'course',
      header: 'Course',
      cell: (i) => <Badge variant="outline">{courseTitle(i)}</Badge>,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Curriculum"
        description="Manage the key-curriculum items shown on each course page."
        actions={
          <>
            <RefreshButton onClick={c.refresh} loading={c.isFetching} />
            <Button onClick={c.openCreate}>
              <PlusIcon />
              New item
            </Button>
          </>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search curriculum…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No curriculum items yet"
        emptyDescription="Add the first curriculum item and link it to a course."
        emptyAction={
          <Button size="sm" onClick={c.openCreate}>
            <PlusIcon />
            New item
          </Button>
        }
        actions={(i) => (
          <RowActions onEdit={() => c.openEdit(i)} onDelete={() => c.setDeleteTarget(i)} />
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
        title={c.editing ? 'Edit curriculum item' : 'New curriculum item'}
        description="A heading and description, attached to a course."
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create item'}
      >
        <CurriculumForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  courseId: c.editing.courseId,
                  heading: c.editing.heading,
                  description: c.editing.description,
                  sortOrder: c.editing.sortOrder,
                }
              : undefined
          }
          onSubmit={(values) => c.submit(values, values)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this curriculum item?"
        description={c.deleteTarget?.heading}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
