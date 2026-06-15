import { PlusIcon } from 'lucide-react'

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
import { Badge } from '@/components/ui/badge'
import { useCrudController } from '@/hooks/use-crud-controller'
import type { Faq } from '@/types/domain'
import { faqHooks } from '../hooks/use-faqs'
import { FaqForm } from '../components/faq-form'
import { FAQ_DEFAULTS } from '../validations/faq.schema'

const FORM_ID = 'faq-form'

export default function FaqsPage() {
  const c = useCrudController<Faq, typeof FAQ_DEFAULTS, Partial<typeof FAQ_DEFAULTS>>(
    faqHooks,
    { sortBy: 'sortOrder', sortOrder: 'asc' },
  )

  const columns: DataTableColumn<Faq>[] = [
    {
      id: 'sortOrder',
      header: '#',
      sortKey: 'sortOrder',
      className: 'w-12 text-muted-foreground',
      cell: (f) => f.sortOrder,
    },
    {
      id: 'question',
      header: 'Question',
      sortKey: 'question',
      cell: (f) => (
        <div className="max-w-xl">
          <p className="font-medium text-foreground">{f.question}</p>
          <p className="line-clamp-1 text-xs text-muted-foreground">{f.answer}</p>
        </div>
      ),
    },
    {
      id: 'placement',
      header: 'Shown on',
      cell: (f) => (
        <div className="flex flex-wrap gap-1">
          {f.showOnHomepage && <Badge variant="secondary">Homepage</Badge>}
          {(f.courses?.length ?? 0) > 0 && (
            <Badge variant="outline">
              {f.courses!.length === 1
                ? f.courses![0].title
                : `${f.courses!.length} courses`}
            </Badge>
          )}
          {!f.showOnHomepage && (f.courses?.length ?? 0) === 0 && (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (f) => <PublishBadge published={f.isPublished} />,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="FAQs"
        description="Manage frequently asked questions shown on the website."
        actions={
          <>
            <RefreshButton onClick={c.refresh} loading={c.isFetching} />
            <Button onClick={c.openCreate}>
              <PlusIcon />
              New FAQ
            </Button>
          </>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search questions…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No FAQs yet"
        emptyDescription="Add your first frequently asked question."
        emptyAction={
          <Button size="sm" onClick={c.openCreate}>
            <PlusIcon />
            New FAQ
          </Button>
        }
        actions={(f) => (
          <RowActions
            onEdit={() => c.openEdit(f)}
            onDelete={() => c.setDeleteTarget(f)}
          />
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
        title={c.editing ? 'Edit FAQ' : 'New FAQ'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create FAQ'}
      >
        <FaqForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  question: c.editing.question,
                  answer: c.editing.answer,
                  sortOrder: c.editing.sortOrder,
                  isPublished: c.editing.isPublished,
                  showOnHomepage: c.editing.showOnHomepage,
                  courseIds:
                    c.editing.courseIds ??
                    c.editing.courses?.map((course) => course.id) ??
                    [],
                }
              : undefined
          }
          onSubmit={(values) => c.submit(values, values)}
        />
      </FormDialog>

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this FAQ?"
        description={c.deleteTarget?.question}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
