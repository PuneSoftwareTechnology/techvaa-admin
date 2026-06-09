import type { ReactNode } from 'react'
import { ConstructionIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'

/** Placeholder shown for routes whose feature module is not yet built. */
export function ComingSoon({ children }: { children?: ReactNode }) {
  return (
    <Card className="items-center justify-center gap-3 border-dashed py-16 text-center ring-0">
      <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <ConstructionIcon className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-heading font-medium text-foreground">
          Module in progress
        </p>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {children ??
            'This section is scaffolded and will be wired up in an upcoming phase.'}
        </p>
      </div>
    </Card>
  )
}
