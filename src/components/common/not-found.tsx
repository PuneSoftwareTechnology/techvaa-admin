import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="font-heading text-6xl font-bold text-primary/20">404</p>
      <div className="space-y-1">
        <h1 className="font-heading text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you’re looking for doesn’t exist or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to dashboard</Link>
      </Button>
    </div>
  )
}
