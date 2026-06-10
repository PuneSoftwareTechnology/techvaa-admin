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
import { PublishBadge } from '@/components/common/badges'
import { formatDate } from '@/lib/format'
import { useCrudController } from '@/hooks/use-crud-controller'
import type { Blog } from '@/types/domain'
import { blogHooks } from '../hooks/use-blogs'
import { BlogForm } from '../components/blog-form'
import { BLOG_DEFAULTS } from '../validations/blog.schema'

const FORM_ID = 'blog-form'

export default function BlogsPage() {
  const c = useCrudController<
    Blog,
    typeof BLOG_DEFAULTS,
    Partial<typeof BLOG_DEFAULTS>
  >(blogHooks, { sortBy: 'createdAt', sortOrder: 'desc' })

  const columns: DataTableColumn<Blog>[] = [
    {
      id: 'title',
      header: 'Title',
      sortKey: 'title',
      cell: (b) => (
        <div className="max-w-md">
          <p className="truncate font-medium text-foreground">{b.title}</p>
          {(b.metaDescription ?? b.introduction) && (
            <p className="line-clamp-1 text-xs text-muted-foreground">
              {b.metaDescription ?? b.introduction}
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      cell: (b) => <Badge variant="ghost">{b.category?.name ?? '—'}</Badge>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (b) => <PublishBadge published={b.isPublished} />,
    },
    {
      id: 'published',
      header: 'Published',
      sortKey: 'publishedAt',
      cell: (b) => (
        <span className="text-muted-foreground">
          {b.isPublished ? formatDate(b.publishedAt) : '—'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Blogs"
        description="Write and publish blog articles."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New post
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search posts…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No posts yet"
        emptyDescription="Write your first blog post."
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
        title={c.editing ? 'Edit post' : 'New post'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create post'}
      >
        <BlogForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  title: c.editing.title,
                  slug: c.editing.slug,
                  metaDescription: c.editing.metaDescription ?? '',
                  featuredImage: c.editing.featuredImage ?? '',
                  introduction: c.editing.introduction,
                  primaryTitle: c.editing.primaryTitle ?? '',
                  primaryIntro: c.editing.primaryIntro ?? '',
                  primaryImage: c.editing.primaryImage ?? '',
                  primaryText: c.editing.primaryText ?? '',
                  secondaryTitle: c.editing.secondaryTitle ?? '',
                  secondaryIntro: c.editing.secondaryIntro ?? '',
                  secondaryImage: c.editing.secondaryImage ?? '',
                  secondaryText: c.editing.secondaryText ?? '',
                  tertiaryTitle: c.editing.tertiaryTitle ?? '',
                  tertiaryIntro: c.editing.tertiaryIntro ?? '',
                  tertiaryImage: c.editing.tertiaryImage ?? '',
                  tertiaryText: c.editing.tertiaryText ?? '',
                  tertiaryPoints: c.editing.tertiaryPoints ?? [],
                  conclusion: c.editing.conclusion ?? '',
                  categoryId: c.editing.categoryId,
                  relatedCourseId: c.editing.relatedCourseId ?? '',
                  showOnHomepage: c.editing.showOnHomepage,
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
        title="Delete this post?"
        description={`"${c.deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
