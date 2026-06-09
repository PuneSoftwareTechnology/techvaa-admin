import { Loader2Icon } from 'lucide-react'

/** Suspense fallback for lazily-loaded route modules. */
export function RouteFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
    </div>
  )
}
