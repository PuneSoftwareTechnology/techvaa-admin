import type { ReactNode } from 'react'
import { PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface RowActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  /** Extra actions rendered before edit/delete. */
  children?: ReactNode
}

/** Standard row actions rendered as side-by-side icon buttons. */
export function RowActions({ onEdit, onDelete, children }: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1">
      {children}
      {onEdit && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Edit"
          onClick={onEdit}
        >
          <PencilIcon className="size-4" />
        </Button>
      )}
      {onDelete && (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Delete"
          className="text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2Icon className="size-4" />
        </Button>
      )}
    </div>
  )
}
