import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'

import type { User } from '@/types/domain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '../validations/user.schema'

interface ResetPasswordDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting?: boolean
  onSubmit: (id: string, password: string) => void
}

export function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
  isSubmitting = false,
  onSubmit,
}: ResetPasswordDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  })

  useEffect(() => {
    if (open) reset({ password: '' })
  }, [open, reset])

  const submit = handleSubmit((values) => {
    if (user) onSubmit(user.id, values.password)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password</DialogTitle>
          <DialogDescription>
            Set a new password for{' '}
            <span className="font-medium text-foreground">
              {user?.name ?? 'this user'}
            </span>
            . Only admins can reset credentials — share it securely.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="text"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="animate-spin" />}
              Reset password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
