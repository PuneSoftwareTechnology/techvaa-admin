import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/** Top-level error boundary so a render error never blanks the whole app. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook for an error-reporting service (Sentry, etc.).
    console.error('Unhandled UI error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="space-y-1">
            <h1 className="font-heading text-xl font-semibold">
              Something went wrong
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              An unexpected error occurred. Try reloading the page.
            </p>
          </div>
          <Button onClick={() => window.location.reload()}>
            <RotateCcwIcon />
            Reload
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
