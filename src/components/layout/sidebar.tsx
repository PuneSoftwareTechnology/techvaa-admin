import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Logo } from '@/components/common/logo'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useUIStore } from '@/store/ui.store'
import { SidebarNav } from './sidebar-nav'

/** Desktop collapsible sidebar (lg+). */
export function DesktopSidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggle = useUIStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-svh shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex',
        collapsed ? 'w-[4.5rem]' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-sidebar-border px-4',
          collapsed && 'justify-center px-0',
        )}
      >
        <Logo collapsed={collapsed} />
      </div>

      <SidebarNav collapsed={collapsed} />

      <div className="border-t border-sidebar-border p-3">
        <Button
          variant="ghost"
          size={collapsed ? 'icon-sm' : 'sm'}
          onClick={toggle}
          className={cn(
            'w-full text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            !collapsed && 'justify-start',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpenIcon className="size-4" />
          ) : (
            <>
              <PanelLeftCloseIcon className="size-4" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  )
}

/** Mobile drawer sidebar (below lg). */
export function MobileSidebar() {
  const open = useUIStore((s) => s.mobileSidebarOpen)
  const setOpen = useUIStore((s) => s.setMobileSidebarOpen)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar p-0 text-sidebar-foreground"
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <Logo />
        </div>
        <SidebarNav onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
