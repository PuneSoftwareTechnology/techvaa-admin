import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { queryClient } from '@/lib/query-client'
import type { ApiError } from '@/types/api'
import { useAuthStore } from '../store/auth.store'
import { authService } from '../services/auth.service'
import type { LoginCredentials } from '../types'

/** Primary auth hook: derived session state + login / logout actions. */
export function useAuth() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const setSession = useAuthStore((s) => s.setSession)
  const clearSession = useAuthStore((s) => s.clearSession)

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (session, credentials) => {
      setSession(session, credentials.rememberMe ?? true)
      toast.success(`Welcome back, ${session.user.name.split(' ')[0]}!`)
      navigate('/', { replace: true })
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Login failed.')
    },
  })

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      clearSession()
      queryClient.clear()
      navigate('/login', { replace: true })
    }
  }, [clearSession, navigate])

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout,
  }
}
