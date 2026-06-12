import type { ReactNode } from 'react'
import { Loader2Icon } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  /** The form id of the <form> inside `children`, so the footer can submit it. */
  formId: string
  children: ReactNode
  submitLabel?: string
  cancelLabel?: string
  isSubmitting?: boolean
  className?: string
}

/**
 * Reusable modal wrapper for create / edit forms. The form lives in
 * `children` and is submitted by the footer button via the shared `formId`.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  formId,
  children,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !isSubmitting && onOpenChange(o)}>
      <DialogContent
        className={cn(
          'flex max-h-[90svh] flex-col overflow-hidden sm:max-w-2xl',
          className,
        )}
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="-mx-5 flex-1 overflow-y-auto px-5">{children}</div>

        <DialogFooter className="shrink-0 border-t border-border pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting && <Loader2Icon className="animate-spin" />}
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
