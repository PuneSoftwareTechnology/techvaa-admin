import { useMemo, useState, type ReactNode } from 'react'
import { DownloadIcon } from 'lucide-react'
import { toast } from 'sonner'

import { RefreshButton } from '@/components/common/refresh-button'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { PAGINATION } from '@/config/constants'
import { formatDate, humanizeEnum } from '@/lib/format'
import { toCsv, downloadCsv } from '@/lib/csv'
import type { SortOrder } from '@/types/api'
import {
  LEAD_STATUSES,
  type CourseEnquiry,
  type Lead,
  type LeadStatus,
} from '@/types/domain'
import { leadHooks, useUpdateLeadStatus } from '@/modules/leads/hooks/use-leads'
import { LeadDetailSheet } from '@/modules/leads/components/lead-detail-sheet'
import {
  courseEnquiryHooks,
  useUpdateCourseEnquiryStatus,
} from '@/modules/course-enquiries/hooks/use-course-enquiries'
import { CourseEnquiryDetailSheet } from '@/modules/course-enquiries/components/course-enquiry-detail-sheet'

/** One enquiry from either source, normalised into a shared row shape. */
type UnifiedRow =
  | { id: string; kind: 'lead'; name: string; contact: string; topic: string; message: string | null; status: LeadStatus; createdAt: string; raw: Lead }
  | { id: string; kind: 'course-enquiry'; name: string; contact: string; topic: string; message: string | null; status: LeadStatus; createdAt: string; raw: CourseEnquiry }

// Pull every row from both tables, then merge / sort / paginate on the client.
const FETCH_ALL = { page: 1, pageSize: 10_000 }

export function AllEnquiriesPanel({ typeFilter }: { typeFilter?: ReactNode }) {
  const leadsQuery = leadHooks.useList(FETCH_ALL)
  const enquiriesQuery = courseEnquiryHooks.useList(FETCH_ALL)
  const updateLead = useUpdateLeadStatus()
  const updateEnquiry = useUpdateCourseEnquiryStatus()
  const deleteLead = leadHooks.useDelete()
  const deleteEnquiry = courseEnquiryHooks.useDelete()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const [sort, setSort] = useState<{ sortBy: string; sortOrder: SortOrder }>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGINATION.defaultPageSize)
  const [selected, setSelected] = useState<UnifiedRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UnifiedRow | null>(null)
  const [exporting, setExporting] = useState(false)

  const all = useMemo<UnifiedRow[]>(() => {
    const leads: UnifiedRow[] = (leadsQuery.data?.data ?? []).map((l) => ({
      id: l.id,
      kind: 'lead',
      name: l.name,
      contact: l.email,
      topic: l.courseInterest ?? '',
      message: l.message ?? null,
      status: l.status,
      createdAt: l.createdAt,
      raw: l,
    }))
    const enquiries: UnifiedRow[] = (enquiriesQuery.data?.data ?? []).map(
      (e) => ({
        id: e.id,
        kind: 'course-enquiry',
        name: e.name,
        contact: e.phone,
        topic: e.course,
        message: e.message ?? null,
        status: e.status,
        createdAt: e.createdAt,
        raw: e,
      }),
    )
    return [...leads, ...enquiries]
  }, [leadsQuery.data, enquiriesQuery.data])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = all.filter((r) => {
      if (status !== 'all' && r.status !== status) return false
      if (!q) return true
      return (
        r.name.toLowerCase().includes(q) ||
        r.contact.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        (r.message?.toLowerCase().includes(q) ?? false)
      )
    })
    const dir = sort.sortOrder === 'asc' ? 1 : -1
    return [...rows].sort((a, b) => {
      if (sort.sortBy === 'name') return a.name.localeCompare(b.name) * dir
      // default + 'createdAt'
      return (
        (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir
      )
    })
  }, [all, search, status, sort])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const meta = { page: safePage, pageSize, total, totalPages }

  function toggleSort(key: string) {
    setSort((s) =>
      s.sortBy === key
        ? { sortBy: key, sortOrder: s.sortOrder === 'asc' ? 'desc' : 'asc' }
        : { sortBy: key, sortOrder: 'asc' },
    )
    setPage(1)
  }

  function updateStatus(row: UnifiedRow, next: LeadStatus) {
    if (row.kind === 'lead') updateLead.mutate({ id: row.id, status: next })
    else updateEnquiry.mutate({ id: row.id, status: next })
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const mutation = deleteTarget.kind === 'lead' ? deleteLead : deleteEnquiry
    mutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  function handleExport() {
    setExporting(true)
    try {
      const csv = toCsv<UnifiedRow>(filtered, [
        { header: 'Type', value: (r) => (r.kind === 'lead' ? 'Lead' : 'Course Enquiry') },
        { header: 'Name', value: (r) => r.name },
        { header: 'Email / Phone', value: (r) => r.contact },
        { header: 'Course / Interest', value: (r) => r.topic },
        { header: 'Message', value: (r) => r.message ?? '' },
        { header: 'Status', value: (r) => humanizeEnum(r.status) },
        { header: 'Received', value: (r) => formatDate(r.createdAt) },
      ])
      downloadCsv(`techvaa-enquiries-all-${Date.now()}.csv`, csv)
      toast.success(`Exported ${filtered.length} enquiries`)
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting(false)
    }
  }

  const columns: DataTableColumn<UnifiedRow>[] = [
    {
      id: 'type',
      header: 'Type',
      cell: (r) =>
        r.kind === 'lead' ? (
          <Badge variant="secondary">Lead</Badge>
        ) : (
          <Badge variant="outline">Course</Badge>
        ),
    },
    {
      id: 'name',
      header: 'Name',
      sortKey: 'name',
      cell: (r) => (
        <div>
          <p className="font-medium text-foreground">{r.name}</p>
          <p className="text-xs text-muted-foreground">{r.contact}</p>
        </div>
      ),
    },
    {
      id: 'topic',
      header: 'Course / Interest',
      cell: (r) => <span className="text-muted-foreground">{r.topic || '—'}</span>,
    },
    {
      id: 'created',
      header: 'Received',
      sortKey: 'createdAt',
      cell: (r) => (
        <span className="text-muted-foreground">{formatDate(r.createdAt)}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (r) => (
        <Select
          value={r.status}
          onValueChange={(v) => updateStatus(r, v as LeadStatus)}
        >
          <SelectTrigger size="sm" className="w-[8.5rem]">
            <SelectValue>
              <LeadStatusBadge status={r.status} />
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
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setPage(1)
        }}
        searchPlaceholder="Search name, email, phone, course…"
        filters={
          <>
            {typeFilter}
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v)
                setPage(1)
              }}
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
            <RefreshButton
              onClick={() => {
                leadsQuery.refetch()
                enquiriesQuery.refetch()
              }}
              loading={leadsQuery.isFetching || enquiriesQuery.isFetching}
            />
            <Button variant="outline" onClick={handleExport} disabled={exporting}>
              <DownloadIcon />
              Export CSV
            </Button>
          </>
        }
      />

      <DataTable
        columns={columns}
        rows={pageRows}
        isLoading={leadsQuery.isLoading || enquiriesQuery.isLoading}
        sort={sort}
        onToggleSort={toggleSort}
        onRowClick={(r) => setSelected(r)}
        emptyTitle="No enquiries found"
        emptyDescription="Leads and course enquiries from the website will appear here."
        actions={(r) => <RowActions onDelete={() => setDeleteTarget(r)} />}
      />

      <DataTablePagination
        meta={meta}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s)
          setPage(1)
        }}
      />

      <LeadDetailSheet
        lead={selected?.kind === 'lead' ? selected.raw : null}
        onOpenChange={(o) => !o && setSelected(null)}
      />
      <CourseEnquiryDetailSheet
        enquiry={selected?.kind === 'course-enquiry' ? selected.raw : null}
        onOpenChange={(o) => !o && setSelected(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete this enquiry?"
        description={`The enquiry from ${deleteTarget?.name} will be permanently removed.`}
        confirmLabel="Delete"
        loading={deleteLead.isPending || deleteEnquiry.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
