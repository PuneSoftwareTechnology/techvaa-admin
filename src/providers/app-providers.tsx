import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

/** Composes all global providers in the correct order. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <BrowserRouter>{children}</BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  )
}
