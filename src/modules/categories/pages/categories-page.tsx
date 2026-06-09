import { PlusIcon } from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
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
import type { BlogCategory } from '@/types/domain'
import { categoryHooks } from '../hooks/use-categories'
import { CategoryForm } from '../components/category-form'
import { CATEGORY_DEFAULTS } from '../validations/category.schema'

const FORM_ID = 'category-form'

export default function CategoriesPage() {
  const c = useCrudController<
    BlogCategory,
    typeof CATEGORY_DEFAULTS,
    Partial<typeof CATEGORY_DEFAULTS>
  >(categoryHooks, { sortBy: 'name', sortOrder: 'asc' })

  const columns: DataTableColumn<BlogCategory>[] = [
    {
      id: 'name',
      header: 'Name',
      sortKey: 'name',
      cell: (cat) => <span className="font-medium text-foreground">{cat.name}</span>,
    },
    {
      id: 'slug',
      header: 'Slug',
      cell: (cat) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{cat.slug}</code>
      ),
    },
    {
      id: 'blogs',
      header: 'Blogs',
      cell: (cat) => <Badge variant="ghost">{cat.blogCount ?? 0}</Badge>,
    },
    {
      id: 'created',
      header: 'Created',
      sortKey: 'createdAt',
      cell: (cat) => (
        <span className="text-muted-foreground">{formatDate(cat.createdAt)}</span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blog Categories"
        description="Organise blog content into categories."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New category
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search categories…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No categories yet"
        emptyDescription="Create your first blog category."
        actions={(cat) => (
          <RowActions onEdit={() => c.openEdit(cat)} onDelete={() => c.setDeleteTarget(cat)} />
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
        title={c.editing ? 'Edit category' : 'New category'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create category'}
        className="sm:max-w-md"
      >
        <CategoryForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  name: c.editing.name,
                  slug: c.editing.slug,
                  description: c.editing.description ?? '',
                }
              : undefined
          }
          onSubmit={(values) => c.submit(values, values)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this category?"
        description={`"${c.deleteTarget?.name}" will be removed. Blogs in this category must be reassigned.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
