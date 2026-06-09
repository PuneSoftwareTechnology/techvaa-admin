/**
 * Centralised, typed access to client environment variables.
 * Only `NEXT_PUBLIC_`-prefixed vars are exposed to the browser bundle, and they
 * must be referenced statically so Next can inline them at build time.
 */
export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api',
  /** When true the repository layer is served by the in-memory mock backend. */
  useMock: (process.env.NEXT_PUBLIC_USE_MOCK ?? 'true') === 'true',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Techvaa Admin',
} as const
