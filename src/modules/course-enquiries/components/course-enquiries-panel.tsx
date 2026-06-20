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
import { LEAD_STATUSES, type CourseEnquiry, type LeadStatus } from '@/types/domain'
import {
  courseEnquiryHooks,
  useUpdateCourseEnquiryStatus,
} from '../hooks/use-course-enquiries'
import { courseEnquiryService } from '../services/course-enquiry.service'
import { CourseEnquiryDetailSheet } from './course-enquiry-detail-sheet'

/** Course-enquiry table for the unified Enquiries page. Mounts only when active. */
export function CourseEnquiriesPanel({ typeFilter }: { typeFilter?: ReactNode }) {
  const c = useCrudController<
    CourseEnquiry,
    Partial<CourseEnquiry>,
    Partial<CourseEnquiry>
  >(courseEnquiryHooks, {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const updateStatus = useUpdateCourseEnquiryStatus()
  const [selected, setSelected] = useState<CourseEnquiry | null>(null)
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      const rows = await courseEnquiryService.exportAll(c.table.params)
      const csv = toCsv<CourseEnquiry>(rows, [
        { header: 'Name', value: (e) => e.name },
        { header: 'Phone', value: (e) => e.phone },
        { header: 'Course', value: (e) => e.course },
        { header: 'Message', value: (e) => e.message ?? '' },
        { header: 'Status', value: (e) => humanizeEnum(e.status) },
        { header: 'Created', value: (e) => formatDate(e.createdAt) },
      ])
      downloadCsv(`techvaa-course-enquiries-${Date.now()}.csv`, csv)
      toast.success(`Exported ${rows.length} enquiries`)
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const columns: DataTableColumn<CourseEnquiry>[] = [
    {
      id: 'name',
      header: 'Enquirer',
      sortKey: 'name',
      cell: (e) => (
        <div>
          <p className="font-medium text-foreground">{e.name}</p>
          <p className="text-xs text-muted-foreground">{e.phone}</p>
        </div>
      ),
    },
    {
      id: 'course',
      header: 'Course',
      cell: (e) => <span className="text-muted-foreground">{e.course}</span>,
    },
    {
      id: 'message',
      header: 'Message',
      cell: (e) => (
        <span className="block max-w-[20rem] truncate text-muted-foreground">
          {e.message ?? '—'}
        </span>
      ),
    },
    {
      id: 'created',
      header: 'Received',
      sortKey: 'createdAt',
      cell: (e) => (
        <span className="text-muted-foreground">{formatDate(e.createdAt)}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (e) => (
        <Select
          value={e.status}
          onValueChange={(v) =>
            updateStatus.mutate({ id: e.id, status: v as LeadStatus })
          }
        >
          <SelectTrigger size="sm" className="w-[8.5rem]">
            <SelectValue>
              <LeadStatusBadge status={e.status} />
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
        searchPlaceholder="Search name, phone, course…"
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
        onRowClick={(e) => setSelected(e)}
        emptyTitle="No enquiries found"
        emptyDescription="Enrollment enquiries from the website will appear here."
        actions={(e) => <RowActions onDelete={() => c.setDeleteTarget(e)} />}
      />

      <DataTablePagination
        meta={c.meta}
        pageSize={c.table.pageSize}
        onPageChange={c.table.setPage}
        onPageSizeChange={c.table.setPageSize}
      />

      <CourseEnquiryDetailSheet
        enquiry={selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />

      <ConfirmDialog
        open={!!c.deleteTarget}
        onOpenChange={(o) => !o && c.setDeleteTarget(null)}
        title="Delete this enquiry?"
        description={`The enquiry from ${c.deleteTarget?.name} for ${c.deleteTarget?.course} will be permanently removed.`}
        confirmLabel="Delete"
        loading={c.isDeleting}
        onConfirm={c.confirmDelete}
      />
    </div>
  )
}
