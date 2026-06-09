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
import { RobotsBadge } from '@/components/common/badges'
import { formatDate } from '@/lib/format'
import { useCrudController } from '@/hooks/use-crud-controller'
import { seoHooks } from '../hooks/use-seo'
import { SeoForm } from '../components/seo-form'
import type { SeoEntry } from '../types'
import { SEO_DEFAULTS, type SeoFormValues } from '../validations/seo.schema'

const FORM_ID = 'seo-form'

/** Form values (keywords as text) <-> entity (keywords as array). */
function toEntry(values: SeoFormValues): Partial<SeoEntry> {
  return {
    ...values,
    keywords: (values.keywords ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean),
  }
}

export default function SeoPage() {
  const c = useCrudController<SeoEntry, Partial<SeoEntry>, Partial<SeoEntry>>(
    seoHooks,
    { sortBy: 'page', sortOrder: 'asc' },
  )

  const columns: DataTableColumn<SeoEntry>[] = [
    {
      id: 'page',
      header: 'Page',
      sortKey: 'page',
      cell: (s) => (
        <div>
          <p className="font-medium text-foreground">{s.page}</p>
          <code className="text-xs text-muted-foreground">{s.path}</code>
        </div>
      ),
    },
    {
      id: 'title',
      header: 'Meta title',
      cell: (s) => (
        <p className="line-clamp-1 max-w-sm text-muted-foreground">{s.metaTitle}</p>
      ),
    },
    {
      id: 'keywords',
      header: 'Keywords',
      cell: (s) => <Badge variant="ghost">{s.keywords.length}</Badge>,
    },
    {
      id: 'robots',
      header: 'Robots',
      cell: (s) => <RobotsBadge robots={s.robots} />,
    },
    {
      id: 'updated',
      header: 'Updated',
      sortKey: 'updatedAt',
      cell: (s) => <span className="text-muted-foreground">{formatDate(s.updatedAt)}</span>,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="SEO"
        description="Manage page metadata, Open Graph and robots directives."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New entry
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search pages…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No SEO entries"
        emptyDescription="Add metadata for your key pages."
        actions={(s) => (
          <RowActions onEdit={() => c.openEdit(s)} onDelete={() => c.setDeleteTarget(s)} />
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
        title={c.editing ? 'Edit SEO entry' : 'New SEO entry'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create entry'}
      >
        <SeoForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  ...SEO_DEFAULTS,
                  page: c.editing.page,
                  path: c.editing.path,
                  metaTitle: c.editing.metaTitle,
                  metaDescription: c.editing.metaDescription,
                  keywords: c.editing.keywords.join(', '),
                  canonicalUrl: c.editing.canonicalUrl ?? '',
                  ogImage: c.editing.ogImage ?? '',
                  robots: c.editing.robots,
                }
              : undefined
          }
          onSubmit={(values) => {
            const entry = toEntry(values)
            c.submit(entry, entry)
          }}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this SEO entry?"
        description={`Metadata for "${c.deleteTarget?.page}" will be removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
