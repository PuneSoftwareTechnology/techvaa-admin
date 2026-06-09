import { useMemo, useState } from 'react'
import {
  KeyRoundIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldCheckIcon,
  Trash2Icon,
} from 'lucide-react'

import { PageHeader } from '@/components/common/page-header'
import { EmptyState } from '@/components/common/empty-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { fromNow, humanizeEnum } from '@/lib/format'
import { PERMISSION_META, roleHasFullAccess } from '@/constants/permissions'
import { useAuth } from '@/modules/auth/hooks/use-auth'
import type { User } from '@/types/domain'
import {
  useCreateUser,
  useDeleteUser,
  useResetPassword,
  useUpdateUser,
  useUsers,
} from '../hooks/use-users'
import { UserFormDialog } from '../components/user-form-dialog'
import { ResetPasswordDialog } from '../components/reset-password-dialog'

/** Short summary of the routes a credential can reach. */
function AccessSummary({ user }: { user: User }) {
  if (roleHasFullAccess(user.role)) {
    return (
      <Badge variant="success" className="gap-1">
        <ShieldCheckIcon /> Full access
      </Badge>
    )
  }
  if (user.permissions.length === 0) {
    return <span className="text-xs text-muted-foreground">No routes</span>
  }
  const labels = user.permissions.map((p) => PERMISSION_META[p].label)
  const shown = labels.slice(0, 3)
  const rest = labels.length - shown.length
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((label) => (
        <Badge key={label} variant="ghost">
          {label}
        </Badge>
      ))}
      {rest > 0 && <Badge variant="outline">+{rest}</Badge>}
    </div>
  )
}

export default function CredentialsPage() {
  const { user: currentUser } = useAuth()

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [resetting, setResetting] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
      pageSize: 100,
    }),
    [debouncedSearch],
  )

  const { data, isLoading, isError } = useUsers(params)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const resetPassword = useResetPassword()
  const deleteUser = useDeleteUser()

  const users = data?.data ?? []

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (user: User) => {
    setEditing(user)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credentials & Access"
        description="Issue logins, reset passwords and control which routes each user can reach."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon /> New credential
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or role…"
          className="pl-9"
          aria-label="Search credentials"
        />
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Route access</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading &&
              users.map((user) => {
                const isSelf = user.id === currentUser?.id
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {humanizeEnum(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <AccessSummary user={user} />
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="ghost">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fromNow(user.lastLoginAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={`Actions for ${user.name}`}
                          >
                            <MoreHorizontalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onSelect={() => openEdit(user)}>
                            <PencilIcon /> Edit access
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setResetting(user)}>
                            <KeyRoundIcon /> Reset password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={isSelf}
                            onSelect={() => setDeleting(user)}
                          >
                            <Trash2Icon /> Revoke
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}

            {!isLoading && users.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={6} className="p-0">
                  <EmptyState
                    icon={ShieldCheckIcon}
                    title={isError ? 'Could not load credentials' : 'No credentials found'}
                    description={
                      isError
                        ? 'Something went wrong while loading users. Try again.'
                        : 'Issue a credential to grant a teammate access to the portal.'
                    }
                    action={
                      !isError && (
                        <Button onClick={openCreate} size="sm">
                          <PlusIcon /> New credential
                        </Button>
                      )
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editing}
        isSubmitting={createUser.isPending || updateUser.isPending}
        onCreate={(dto) =>
          createUser.mutate(dto, { onSuccess: () => setFormOpen(false) })
        }
        onUpdate={(id, dto) =>
          updateUser.mutate({ id, dto }, { onSuccess: () => setFormOpen(false) })
        }
      />

      <ResetPasswordDialog
        user={resetting}
        open={!!resetting}
        onOpenChange={(open) => !open && setResetting(null)}
        isSubmitting={resetPassword.isPending}
        onSubmit={(id, password) =>
          resetPassword.mutate(
            { id, dto: { password } },
            { onSuccess: () => setResetting(null) },
          )
        }
      />

      <AlertDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke this credential?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting?.name}&rsquo;s login will be permanently removed and they
              will lose access immediately. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (deleting)
                  deleteUser.mutate(deleting.id, {
                    onSuccess: () => setDeleting(null),
                  })
              }}
            >
              Revoke access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
