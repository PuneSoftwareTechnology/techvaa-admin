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
        className={className ?? 'max-h-[90svh] overflow-y-auto sm:max-w-2xl'}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter>
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
