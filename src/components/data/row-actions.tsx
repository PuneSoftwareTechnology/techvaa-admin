import type { ReactNode } from 'react'
import { MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface RowActionsProps {
  onEdit?: () => void
  onDelete?: () => void
  /** Extra items rendered above edit/delete. */
  children?: ReactNode
}

/** Standard "⋯" row menu with optional edit/delete and custom items. */
export function RowActions({ onEdit, onDelete, children }: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Row actions">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {children}
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit}>
            <PencilIcon />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            {(children || onEdit) && <DropdownMenuSeparator />}
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
