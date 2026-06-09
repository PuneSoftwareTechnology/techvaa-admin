import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { GRANTABLE_PERMISSIONS } from '@/constants/permissions'
import type { Permission } from '@/types/domain'

interface PermissionSelectorProps {
  value: Permission[]
  onChange?: (next: Permission[]) => void
  /** The full-access role (SUPER_ADMIN) sees every route regardless of selection. */
  fullAccess?: boolean
  /**
   * Render the routes as a non-editable preview. Access is determined by the
   * selected role, so the credential form shows — rather than edits — the set.
   */
  readOnly?: boolean
  disabled?: boolean
}

/**
 * Checklist of grantable routes. With `readOnly`, it previews the routes the
 * selected role unlocks; otherwise it lets an admin tick a custom subset.
 * Replaced by a "full access" notice for the SUPER_ADMIN role.
 */
export function PermissionSelector({
  value,
  onChange,
  fullAccess = false,
  readOnly = false,
  disabled = false,
}: PermissionSelectorProps) {
  const toggle = (key: Permission) => {
    if (readOnly || !onChange) return
    onChange(
      value.includes(key)
        ? value.filter((p) => p !== key)
        : [...value, key],
    )
  }

  const allKeys = GRANTABLE_PERMISSIONS.map((p) => p.key)
  const allSelected = allKeys.every((k) => value.includes(k))

  if (fullAccess) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-sm text-muted-foreground">
        <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
        <span>
          The <span className="font-medium text-foreground">Super Admin</span> role has{' '}
          <span className="font-medium text-foreground">full access</span> to every
          route, including credential management. Route selection is not required.
        </span>
      </div>
    )
  }

  const locked = readOnly || disabled

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          {readOnly
            ? `${value.length} route${value.length === 1 ? '' : 's'} granted by this role`
            : `${value.length} of ${allKeys.length} routes enabled`}
        </p>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={disabled}
            onClick={() => onChange?.(allSelected ? [] : allKeys)}
          >
            {allSelected ? 'Clear all' : 'Select all'}
          </Button>
        )}
      </div>

      <div className="grid max-h-64 grid-cols-1 gap-1.5 overflow-y-auto rounded-lg border border-border p-1.5 sm:grid-cols-2">
        {GRANTABLE_PERMISSIONS.map((perm) => {
          const checked = value.includes(perm.key)
          return (
            <label
              key={perm.key}
              className={cn(
                'flex items-start gap-2.5 rounded-md p-2.5 transition-colors',
                !locked && 'cursor-pointer hover:bg-muted/60',
                checked && 'bg-muted/50',
                disabled && 'pointer-events-none opacity-50',
                readOnly && !checked && 'opacity-50',
              )}
            >
              <Checkbox
                checked={checked}
                onCheckedChange={() => toggle(perm.key)}
                disabled={locked}
                className="mt-0.5"
              />
              <span className="space-y-0.5">
                <span className="block text-sm leading-none font-medium text-foreground">
                  {perm.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {perm.description}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
