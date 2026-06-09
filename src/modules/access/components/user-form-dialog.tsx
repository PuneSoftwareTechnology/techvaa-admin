import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon } from 'lucide-react'

import { humanizeEnum } from '@/lib/format'
import { permissionsForRole, roleHasFullAccess } from '@/constants/permissions'
import { USER_ROLES, type User } from '@/types/domain'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { buildUserSchema, type UserFormValues } from '../validations/user.schema'
import type { CreateUserDto, UpdateUserDto } from '../types'
import { PermissionSelector } from './permission-selector'

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Provided when editing an existing credential. */
  user?: User | null
  isSubmitting?: boolean
  onCreate: (dto: CreateUserDto) => void
  onUpdate: (id: string, dto: UpdateUserDto) => void
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  isSubmitting = false,
  onCreate,
  onUpdate,
}: UserFormDialogProps) {
  const mode = user ? 'edit' : 'create'
  const schema = useMemo(() => buildUserSchema(mode), [mode])

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'MARKETING_EXECUTIVE',
      permissions: [],
      isActive: true,
    },
  })

  // Re-seed the form whenever the dialog opens or the target user changes.
  useEffect(() => {
    if (!open) return
    reset(
      user
        ? {
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            permissions: user.permissions,
            isActive: user.isActive,
          }
        : {
            name: '',
            email: '',
            password: '',
            role: 'MARKETING_EXECUTIVE',
            permissions: [],
            isActive: true,
          },
    )
  }, [open, user, reset])

  const role = watch('role')
  const fullAccess = roleHasFullAccess(role)
  // Access is determined by the selected role — derived, not hand-picked.
  const rolePermissions = permissionsForRole(role)

  const onSubmit = handleSubmit((values) => {
    if (user) {
      const dto: UpdateUserDto = {
        name: values.name,
        role: values.role,
        permissions: permissionsForRole(values.role),
        isActive: values.isActive,
      }
      onUpdate(user.id, dto)
      return
    }
    const dto: CreateUserDto = {
      name: values.name,
      email: values.email ?? '',
      password: values.password ?? '',
      role: values.role,
      permissions: permissionsForRole(values.role),
      isActive: values.isActive,
    }
    onCreate(dto)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {user ? 'Edit credential' : 'Issue new credential'}
          </DialogTitle>
          <DialogDescription>
            {user
              ? 'Update the role and the routes this user can access.'
              : 'Create a login and choose exactly which routes it can access.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@techvaa.com"
                autoComplete="off"
                disabled={mode === 'edit'}
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {mode === 'edit' ? (
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed after a credential is issued.
                </p>
              ) : (
                errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )
              )}
            </div>
          </div>

          {mode === 'create' && (
            <div className="space-y-1.5">
              <Label htmlFor="password">Temporary password</Label>
              <Input
                id="password"
                type="text"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              {errors.password ? (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Share this with the user securely. They sign in with it
                  directly — there is no self-service reset.
                </p>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {USER_ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {humanizeEnum(r)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="isActive">Status</Label>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <label className="flex h-9 cursor-pointer items-center gap-2.5 text-sm">
                    <Switch
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-muted-foreground">
                      {field.value ? 'Active — can sign in' : 'Deactivated'}
                    </span>
                  </label>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Route access</Label>
            <PermissionSelector
              value={rolePermissions}
              fullAccess={fullAccess}
              readOnly
            />
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
              {user ? 'Save changes' : 'Issue credential'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
