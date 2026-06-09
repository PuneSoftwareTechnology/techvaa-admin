import { PlusIcon, ExternalLinkIcon } from 'lucide-react'

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
import type { Placement } from '@/types/domain'
import { placementHooks } from '../hooks/use-placements'
import { PlacementForm } from '../components/placement-form'
import { PLACEMENT_DEFAULTS } from '../validations/placement.schema'

const FORM_ID = 'placement-form'

export default function PlacementsPage() {
  const c = useCrudController<
    Placement,
    typeof PLACEMENT_DEFAULTS,
    Partial<typeof PLACEMENT_DEFAULTS>
  >(placementHooks, { sortBy: 'joiningDate', sortOrder: 'desc' })

  const columns: DataTableColumn<Placement>[] = [
    {
      id: 'student',
      header: 'Student',
      sortKey: 'studentName',
      cell: (p) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{p.studentName}</span>
          {p.linkedinUrl && (
            <a
              href={p.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
              aria-label="LinkedIn profile"
            >
              <ExternalLinkIcon className="size-3.5" />
            </a>
          )}
        </div>
      ),
    },
    {
      id: 'company',
      header: 'Company',
      sortKey: 'company',
      cell: (p) => p.company,
    },
    {
      id: 'package',
      header: 'Package',
      cell: (p) => (p.package ? <Badge variant="success">{p.package}</Badge> : '—'),
    },
    {
      id: 'course',
      header: 'Course',
      cell: (p) => <span className="text-muted-foreground">{p.course ?? '—'}</span>,
    },
    {
      id: 'joined',
      header: 'Joined',
      sortKey: 'joiningDate',
      cell: (p) => <span className="text-muted-foreground">{formatDate(p.joiningDate)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (p) => <PublishBadge published={p.isPublished} />,
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader
        title="Placements"
        description="Showcase student placement success stories."
        actions={
          <Button onClick={c.openCreate}>
            <PlusIcon />
            New placement
          </Button>
        }
      />

      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search placements…"
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        emptyTitle="No placements yet"
        emptyDescription="Add your first placement story."
        actions={(p) => (
          <RowActions onEdit={() => c.openEdit(p)} onDelete={() => c.setDeleteTarget(p)} />
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
        title={c.editing ? 'Edit placement' : 'New placement'}
        formId={FORM_ID}
        isSubmitting={c.isSubmitting}
        submitLabel={c.editing ? 'Save changes' : 'Create placement'}
      >
        <PlacementForm
          formId={FORM_ID}
          defaultValues={
            c.editing
              ? {
                  studentName: c.editing.studentName,
                  company: c.editing.company,
                  package: c.editing.package ?? '',
                  course: c.editing.course ?? '',
                  image: c.editing.image ?? '',
                  linkedinUrl: c.editing.linkedinUrl ?? '',
                  joiningDate: c.editing.joiningDate
                    ? c.editing.joiningDate.slice(0, 10)
                    : '',
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
        title="Delete this placement?"
        description={`${c.deleteTarget?.studentName} at ${c.deleteTarget?.company} will be removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
