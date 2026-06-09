/**
 * Tiny dependency-free bridge between the auth store and the axios client.
 * Keeps the HTTP layer decoupled from the store (no circular imports) while
 * letting interceptors read the current token and trigger a global logout.
 */
let accessToken: string | null = null
let onUnauthorized: (() => void) | null = null

export const sessionBridge = {
  getToken: () => accessToken,
  setToken: (token: string | null) => {
    accessToken = token
  },
  setUnauthorizedHandler: (handler: (() => void) | null) => {
    onUnauthorized = handler
  },
  notifyUnauthorized: () => onUnauthorized?.(),
}
