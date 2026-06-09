import { useEffect } from 'react'

import { AppProviders } from '@/providers/app-providers'
import { AppRoutes } from '@/routes'
import { ErrorBoundary } from '@/components/common/error-boundary'
import { sessionBridge } from '@/api/session-bridge'
import { useAuthStore } from '@/modules/auth/store/auth.store'

export default function App() {
  // Wire the HTTP layer's 401 handler to the auth store. On an expired/invalid
  // session the guards redirect to /login on the next render.
  useEffect(() => {
    sessionBridge.setUnauthorizedHandler(() =>
      useAuthStore.getState().clearSession(),
    )
    return () => sessionBridge.setUnauthorizedHandler(null)
  }, [])

  return (
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </ErrorBoundary>
  )
}
