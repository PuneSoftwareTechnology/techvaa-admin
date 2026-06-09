import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'

import { env } from '@/config/env'
import type { ApiError } from '@/types/api'
import { sessionBridge } from './session-bridge'

/** Single shared axios instance. `withCredentials` enables httpOnly cookies. */
export const http: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach bearer token (when present) — complements httpOnly cookie auth.
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionBridge.getToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  return config
})

// Normalise responses + errors. 401 -> global logout.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string; fieldErrors?: Record<string, string> }>) => {
    if (error.response?.status === 401) {
      sessionBridge.notifyUnauthorized()
    }
    return Promise.reject(toApiError(error))
  },
)

/** Convert any thrown value into the UI-friendly ApiError shape. */
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; code?: string; fieldErrors?: Record<string, string> }
      | undefined
    return {
      message:
        data?.message ??
        error.message ??
        'Something went wrong. Please try again.',
      status: error.response?.status,
      code: data?.code,
      fieldErrors: data?.fieldErrors,
    }
  }
  if (error instanceof Error) return { message: error.message }
  return { message: 'Unexpected error' }
}
