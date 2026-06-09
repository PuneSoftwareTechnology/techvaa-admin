import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, type DataTableColumn } from '@/components/data/data-table'
import { DataTableToolbar } from '@/components/data/data-table-toolbar'
import { DataTablePagination } from '@/components/data/data-table-pagination'
import { RowActions } from '@/components/data/row-actions'
import { FormDialog } from '@/components/data/form-dialog'
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { PublishBadge, CourseLevelBadge } from '@/components/common/badges'
import { Badge } from '@/components/ui/badge'
import { formatDate, humanizeEnum } from '@/lib/format'
import { useCrudController } from '@/hooks/use-crud-controller'
import { COURSE_LEVELS, type Course } from '@/types/domain'
import { seoToFormValues } from '@/modules/seo/validations/entity-seo.schema'
import { courseHooks } from '../hooks/use-courses'
import { CourseForm } from '../components/course-form'
import { COURSE_DEFAULTS } from '../validations/course.schema'

const FORM_ID = 'course-form'

export default function CoursesPage() {
  const c = useCrudController<
    Course,
    typeof COURSE_DEFAULTS,
    Partial<typeof COURSE_DEFAULTS>
  >(courseHooks, { sortBy: 'createdAt', sortOrder: 'desc' })

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
      id: 'level',
      header: 'Level',
      cell: (course) => <CourseLevelBadge level={course.level} />,
    },
    {
      id: 'duration',
      header: 'Duration',
      cell: (course) => (
        <span className="text-muted-foreground">{course.duration ?? '—'}</span>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      cell: (course) => (course.price ? `₹${course.price}` : '—'),
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
        filters={
          <Select
            value={(c.table.filters.level as string) ?? 'all'}
            onValueChange={(v) => c.table.setFilter('level', v === 'all' ? undefined : v)}
          >
            <SelectTrigger size="sm" className="w-40">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {COURSE_LEVELS.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {humanizeEnum(lvl)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
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
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create course'}
      >
        <CourseForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  title: c.editing.title,
                  slug: c.editing.slug,
                  shortDescription: c.editing.shortDescription ?? '',
                  description: c.editing.description,
                  duration: c.editing.duration ?? '',
                  level: c.editing.level,
                  price: c.editing.price ?? '',
                  image: c.editing.image ?? '',
                  isFeatured: c.editing.isFeatured,
                  isPublished: c.editing.isPublished,
                  seo: seoToFormValues(c.editing.seo),
                }
              : undefined
          }
          onSubmit={(values) => c.submit(values, values)}
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
