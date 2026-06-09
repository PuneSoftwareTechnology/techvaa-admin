/** App-wide constants shared across modules. */
export const APP = {
  name: 'Techvaa Admin',
  shortName: 'Techvaa',
  description: 'Admin panel for the Techvaa SAP Training Institute platform.',
} as const

/** Token / session storage keys. */
export const STORAGE_KEYS = {
  auth: 'techvaa.auth',
  ui: 'techvaa.ui',
} as const

/** Default pagination settings used by data tables and list queries. */
export const PAGINATION = {
  defaultPage: 1,
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
} as const

/** Idle window (ms) after which an authenticated session auto-logs-out. */
export const AUTO_LOGOUT_MS = 30 * 60 * 1000 // 30 minutes
