import { MenuIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui.store'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Breadcrumbs } from './breadcrumbs'
import { UserMenu } from './user-menu'

export function Topbar() {
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 lg:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <MenuIcon className="size-5" />
      </Button>

      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  )
}
