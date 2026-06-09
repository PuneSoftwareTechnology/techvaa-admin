import { NavLink } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { NAV_ITEMS, type NavItem } from '@/constants/navigation'
import { hasPermission } from '@/constants/permissions'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

/** Groups nav items by their `group` label, preserving insertion order. */
function groupItems(items: NavItem[]) {
  const groups: { label: string; items: NavItem[] }[] = []
  for (const item of items) {
    const label = item.group ?? ''
    let group = groups.find((g) => g.label === label)
    if (!group) {
      group = { label, items: [] }
      groups.push(group)
    }
    group.items.push(item)
  }
  return groups
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: {
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const user = useAuthStore((s) => s.user)
  // RBAC: only surface routes this user is allowed to reach.
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.permission || hasPermission(user, item.permission),
  )
  const groups = groupItems(visibleItems)

  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {group.label && !collapsed && (
            <p className="px-3 pb-1 text-[0.65rem] font-semibold tracking-wider text-sidebar-foreground/45 uppercase">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const link = (
              <NavLink
                to={item.to}
                end={item.to === '/'}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    'focus-visible:ring-3 focus-visible:ring-sidebar-ring/50 focus-visible:outline-none',
                    isActive &&
                      'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground',
                    collapsed && 'justify-center px-0',
                  )
                }
              >
                <item.icon className="size-[1.125rem] shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            )

            return collapsed ? (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            ) : (
              <div key={item.to}>{link}</div>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
