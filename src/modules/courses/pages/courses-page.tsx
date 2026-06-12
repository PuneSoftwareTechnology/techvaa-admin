import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import { DataTable, type DataTableColumn } from '@/components/data/data-table'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { RowActions } from '@/components/data/row-actions'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { PublishBadge } from '@/components/common/badges'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/format'
import { useCrudController } from '@/hooks/use-crud-controller'
import { type Course } from '@/types/domain'
import { seoToFormValues } from '@/modules/seo/validations/entity-seo.schema'
import { courseHooks } from '../hooks/use-courses'
import { CourseForm } from '../components/course-form'
import { CourseRelations } from '../components/course-relations'
import { COURSE_DEFAULTS } from '../validations/course.schema'

const FORM_ID = 'course-form'

export default function CoursesPage() {
  const c = useCrudController<
    Course,
    typeof COURSE_DEFAULTS,
    Partial<typeof COURSE_DEFAULTS>
  >(courseHooks, { sortBy: 'createdAt', sortOrder: 'desc' })

  const createCourse = courseHooks.useCreate()

  // On create we keep the dialog open and switch it into edit mode for the new
  // course, so the linked-content panels (curriculum / batches / FAQs) unlock.
  const handleSubmit = async (values: typeof COURSE_DEFAULTS) => {
    if (c.editing) {
      await c.submit(values, values)
    } else {
      const created = await createCourse.mutateAsync(values)
      c.openEdit(created)
    }
  }

  const columns: DataTableColumn<Course>[] = [
    {
      id: 'title',
      header: 'Course',
      sortKey: 'title',
      cell: (course) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{course.title}</span>
          {course.isFeatured && <Badge variant="warning">Featured</Badge>}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (course) => <PublishBadge published={course.isPublished} />,
    },
    {
      id: 'created',
      header: 'Created',
      sortKey: 'createdAt',
      cell: (course) => (
        <span className="text-muted-foreground">{formatDate(course.createdAt)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Courses"
        description="Create, publish and manage SAP training courses."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New course
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search courses…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No courses yet"
        emptyDescription="Create your first SAP training course."
        actions={(course) => (
          <RowActions onEdit={() => c.openEdit(course)} onDelete={() => c.setDeleteTarget(course)} />
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
        title={c.editing ? 'Edit course' : 'New course'}
        description="Course details shown on the website."
        formId={FORM_ID}
        isSubmitting={c.isSubmitting || createCourse.isPending}
        submitLabel={c.editing ? 'Save changes' : 'Create course'}
        className="w-[90vw] sm:max-w-[90vw]"
      >
        <CourseForm
          formId={FORM_ID}
          excludeId={c.editing?.id}
          defaultValues={
            c.editing
              ? {
                  title: c.editing.title,
                  slug: c.editing.slug,
                  shortDescription: c.editing.shortDescription ?? '',
                  description: c.editing.description,
                  duration: c.editing.duration ?? '',
                  relatedCourseIds: c.editing.relatedCourseIds ?? [],
                  image: c.editing.image ?? '',
                  isFeatured: c.editing.isFeatured,
                  isPublished: c.editing.isPublished,
                  seo: seoToFormValues(c.editing.seo),
                }
              : undefined
          }
          aside={
            <CourseRelations
              courseId={c.editing?.id}
              onUnlock={() =>
                (
                  document.getElementById(FORM_ID) as HTMLFormElement | null
                )?.requestSubmit()
              }
            />
          }
          onSubmit={handleSubmit}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this course?"
        description={`"${c.deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
