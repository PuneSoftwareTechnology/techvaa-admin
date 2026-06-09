import { Outlet } from 'react-router-dom'

import { DesktopSidebar, MobileSidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { useAutoLogout } from '@/modules/auth/hooks/use-auto-logout'

/** Authenticated application shell: sidebar + topbar + routed content. */
export function AdminLayout() {
  useAutoLogout()

  return (
    <div className="flex min-h-svh bg-background">
      <DesktopSidebar />
      <MobileSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 py-6 lg:px-6 lg:py-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
