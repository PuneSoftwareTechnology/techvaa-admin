import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { STORAGE_KEYS } from '@/config/constants'
import { sessionBridge } from '@/api/session-bridge'
import type { User } from '@/types/domain'
import type { AuthSession, AuthStatus } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  status: AuthStatus
  /** Whether the session should survive a full browser restart. */
  rememberMe: boolean
  setSession: (session: AuthSession, rememberMe?: boolean) => void
  setUser: (user: User) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      status: 'unknown',
      rememberMe: true,
      setSession: ({ user, token }, rememberMe = true) => {
        sessionBridge.setToken(token)
        set({ user, token, status: 'authenticated', rememberMe })
      },
      setUser: (user) => set({ user }),
      clearSession: () => {
        sessionBridge.setToken(null)
        set({ user: null, token: null, status: 'unauthenticated' })
      },
    }),
    {
      name: STORAGE_KEYS.auth,
      // When "remember me" is off the token is kept in memory only — it is
      // omitted from persisted state so a browser restart ends the session.
      partialize: (s) =>
        s.rememberMe
          ? { user: s.user, token: s.token, rememberMe: s.rememberMe }
          : { rememberMe: s.rememberMe },
      onRehydrateStorage: () => (state) => {
        // Re-seed the HTTP layer with the persisted token after refresh.
        if (state?.token) sessionBridge.setToken(state.token)
        if (state) state.status = state.token ? 'authenticated' : 'unauthenticated'
      },
    },
  ),
)
