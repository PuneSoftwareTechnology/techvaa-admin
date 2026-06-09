import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/config/constants'

export type Theme = 'light' | 'dark' | 'system'

interface UIState {
  theme: Theme
  /** Desktop sidebar collapsed (icon-only) state. */
  sidebarCollapsed: boolean
  /** Mobile sidebar drawer open state (not persisted). */
  mobileSidebarOpen: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
}

/** Resolve a Theme to the concrete class to apply on <html>. */
function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  return theme
}

/** Apply the resolved theme to the document root. */
export function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme)
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  root.style.colorScheme = resolved
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      sidebarCollapsed: false,
      mobileSidebarOpen: false,
      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        set({ theme: next })
      },
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
      setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
    }),
    {
      name: STORAGE_KEYS.ui,
      partialize: (s) => ({
        theme: s.theme,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    },
  ),
)
