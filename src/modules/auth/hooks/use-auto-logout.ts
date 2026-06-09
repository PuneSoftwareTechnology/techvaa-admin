import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

import { AUTO_LOGOUT_MS } from '@/config/constants'
import { useAuthStore } from '../store/auth.store'
import { useAuth } from './use-auth'

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
] as const

/**
 * Logs the user out after a window of inactivity. Mounted inside the
 * authenticated shell so the timer only runs for signed-in sessions.
 */
export function useAutoLogout() {
  const { logout } = useAuth()
  const status = useAuthStore((s) => s.status)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (status !== 'authenticated') return

    const reset = () => {
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        toast.info('You were signed out due to inactivity.')
        logout()
      }, AUTO_LOGOUT_MS)
    }

    reset()
    ACTIVITY_EVENTS.forEach((e) =>
      window.addEventListener(e, reset, { passive: true }),
    )

    return () => {
      window.clearTimeout(timer.current)
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [status, logout])
}
