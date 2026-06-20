import { useState, type ReactNode } from 'react'
import { DownloadIcon } from 'lucide-react'
import { toast } from 'sonner'

import { RefreshButton } from '@/components/common/refresh-button'
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
import { ConfirmDialog } from '@/components/data/confirm-dialog'
import { LeadStatusBadge } from '@/components/common/badges'
import { formatDate, humanizeEnum } from '@/lib/format'
import { toCsv, downloadCsv } from '@/lib/csv'
import { useCrudController } from '@/hooks/use-crud-controller'
import { LEAD_STATUSES, type Lead, type LeadStatus } from '@/types/domain'
import { leadHooks, useUpdateLeadStatus } from '../hooks/use-leads'
import { leadService } from '../services/lead.service'
import { LeadDetailSheet } from './lead-detail-sheet'

/** Leads table for the unified Enquiries page. Mounts only when its tab is active. */
export function LeadsPanel({ typeFilter }: { typeFilter?: ReactNode }) {
  const c = useCrudController<Lead, Partial<Lead>, Partial<Lead>>(leadHooks, {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const updateStatus = useUpdateLeadStatus()
  const [selected, setSelected] = useState<Lead | null>(null)
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const rows = await leadService.exportAll(c.table.params)
      const csv = toCsv<Lead>(rows, [
        { header: 'Name', value: (l) => l.name },
        { header: 'Email', value: (l) => l.email },
        { header: 'Phone', value: (l) => l.phone ?? '' },
        { header: 'Message', value: (l) => l.message ?? '' },
        { header: 'Status', value: (l) => humanizeEnum(l.status) },
        { header: 'Created', value: (l) => formatDate(l.createdAt) },
      ])
      downloadCsv(`techvaa-leads-${Date.now()}.csv`, csv)
      toast.success(`Exported ${rows.length} leads`)
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const columns: DataTableColumn<Lead>[] = [
    {
      id: 'name',
      header: 'Lead',
      sortKey: 'name',
      cell: (l) => (
        <div>
          <p className="font-medium text-foreground">{l.name}</p>
          <p className="text-xs text-muted-foreground">{l.email}</p>
        </div>
      ),
    },
    {
      id: 'message',
      header: 'Message',
      cell: (l) => (
        <span className="block max-w-[22rem] truncate text-muted-foreground">
          {l.message ?? '—'}
        </span>
      ),
    },
    {
      id: 'created',
      header: 'Received',
      sortKey: 'createdAt',
      cell: (l) => <span className="text-muted-foreground">{formatDate(l.createdAt)}</span>,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (l) => (
        <Select
          value={l.status}
          onValueChange={(v) =>
            updateStatus.mutate({ id: l.id, status: v as LeadStatus })
          }
        >
          <SelectTrigger size="sm" className="w-[8.5rem]">
            <SelectValue>
              <LeadStatusBadge status={l.status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {humanizeEnum(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ]

  return (
    <div className="space-y-5">
      <DataTableToolbar
        search={c.table.search}
        onSearchChange={c.table.setSearch}
        searchPlaceholder="Search name, email, phone…"
        filters={
          <>
            {typeFilter}
            <Select
              value={(c.table.filters.status as string) ?? 'all'}
              onValueChange={(v) =>
                c.table.setFilter('status', v === 'all' ? undefined : v)
              }
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {LEAD_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {humanizeEnum(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
        actions={
          <>
            <RefreshButton onClick={c.refresh} loading={c.isFetching} />
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              <DownloadIcon />
              Export CSV
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={c.rows}
        isLoading={c.query.isLoading}
        sort={c.table.sort}
        onToggleSort={c.table.toggleSort}
        onRowClick={(l) => setSelected(l)}
        emptyTitle="No leads found"
        emptyDescription="Enquiries from the website will appear here."
        actions={(l) => <RowActions onDelete={() => c.setDeleteTarget(l)} />}
      />

      <DataTablePagination
        meta={c.meta}
        pageSize={c.table.pageSize}
        onPageChange={c.table.setPage}
        onPageSizeChange={c.table.setPageSize}
      />

      <LeadDetailSheet lead={selected} onOpenChange={(o) => !o && setSelected(null)} />

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this lead?"
        description={`The enquiry from ${c.deleteTarget?.name} will be permanently removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
