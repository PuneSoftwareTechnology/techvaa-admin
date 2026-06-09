"use client";

import dynamic from "next/dynamic";

/**
 * Optional catch-all route. Every non-`/api` path renders the existing
 * React-Router SPA, which then takes over routing client-side. The SPA uses
 * `BrowserRouter` (needs `window`), so we load it with `ssr: false`.
 *
 * `/api/*` is served by the route handlers under `src/app/api`, which are more
 * specific than this catch-all and therefore win.
 */
const App = dynamic(() => import("@/App"), { ssr: false });

export default function CatchAllPage() {
  return <App />;
}
