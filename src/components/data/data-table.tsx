import type { ReactNode } from 'react'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { SortOrder } from '@/types/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/empty-state'

export interface DataTableColumn<T> {
  id: string
  header: ReactNode
  cell: (row: T) => ReactNode
  /** Field name sent to the API for sorting; enables the sort affordance. */
  sortKey?: string
  className?: string
  headClassName?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[] | undefined
  isLoading?: boolean
  rowKey?: (row: T) => string
  sort?: { sortBy?: string; sortOrder: SortOrder }
  onToggleSort?: (key: string) => void
  /** Right-aligned per-row actions (rendered in a trailing cell). */
  actions?: (row: T) => ReactNode
  onRowClick?: (row: T) => void
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: ReactNode
  skeletonRows?: number
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

export function DataTable<T>({
  columns,
  rows,
  isLoading,
  rowKey = (row) => (row as { id: string }).id,
  sort,
  onToggleSort,
  actions,
  onRowClick,
  emptyTitle = 'Nothing here yet',
  emptyDescription = 'Records will appear here once added.',
  emptyAction,
  skeletonRows = 8,
}: DataTableProps<T>) {
  const colCount = columns.length + (actions ? 1 : 0)
  const showEmpty = !isLoading && rows && rows.length === 0

  return (
    <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((col) => {
              const sortable = !!col.sortKey && !!onToggleSort
              const active = sort?.sortBy === col.sortKey
              return (
                <TableHead
                  key={col.id}
                  className={cn(col.align && alignClass[col.align], col.headClassName)}
                >
                  {sortable ? (
                    <button
                      type="button"
                      onClick={() => onToggleSort?.(col.sortKey as string)}
                      className={cn(
                        'inline-flex items-center gap-1 transition-colors hover:text-foreground',
                        active && 'text-foreground',
                      )}
                    >
                      {col.header}
                      {active ? (
                        sort?.sortOrder === 'asc' ? (
                          <ArrowUpIcon className="size-3.5" />
                        ) : (
                          <ArrowDownIcon className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDownIcon className="size-3.5 opacity-50" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
            {actions && <TableHead className="w-12 text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={`skeleton-${i}`} className="hover:bg-transparent">
                {columns.map((col) => (
                  <TableCell key={col.id}>
                    <Skeleton className="h-4 w-full max-w-[140px]" />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <Skeleton className="ml-auto size-7 rounded-md" />
                  </TableCell>
                )}
              </TableRow>
            ))}

          {!isLoading &&
            rows?.map((row) => (
              <TableRow
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    className={cn(col.align && alignClass[col.align], col.className)}
                  >
                    {col.cell(row)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell
                    className="text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </TableCell>
                )}
              </TableRow>
            ))}

          {showEmpty && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colCount} className="p-0">
                <EmptyState
                  title={emptyTitle}
                  description={emptyDescription}
                  action={emptyAction}
                />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
