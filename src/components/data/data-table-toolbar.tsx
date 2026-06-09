import type { ReactNode } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'

import { Input } from '@/components/ui/input'

interface DataTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  /** Filter controls rendered between the search box and actions. */
  filters?: ReactNode
  /** Right-aligned actions, typically the "Create" button. */
  actions?: ReactNode
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
  filters,
  actions,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
            aria-label="Search"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <XIcon className="size-4" />
            </button>
          )}
        </div>
        {filters}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
