import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  hint?: string
  /** Tailwind text/bg accent for the icon chip. */
  accent?: string
  isLoading?: boolean
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = 'text-primary bg-primary/10',
  isLoading,
}: StatCardProps) {
  return (
    <Card className="gap-0 py-0 ring-foreground/8">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0 space-y-1">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p className="font-heading text-2xl font-semibold tracking-tight">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
          )}
          {hint && !isLoading && (
            <p className="text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-lg',
            accent,
          )}
        >
          <Icon className="size-5" />
        </span>
      </div>
    </Card>
  )
}
