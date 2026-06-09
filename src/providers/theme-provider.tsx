import { useEffect, type ReactNode } from 'react'

import { applyTheme, useUIStore } from '@/store/ui.store'

/** Applies the persisted theme on mount and keeps it in sync with the OS. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useUIStore((s) => s.theme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (theme !== 'system') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  return <>{children}</>
}
