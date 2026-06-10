import { StarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { humanizeEnum } from '@/lib/format'
import { Badge } from '@/components/ui/badge'
import type { LeadStatus, RobotsDirective } from '@/types/domain'

export function PublishBadge({ published }: { published: boolean }) {
  return (
    <Badge variant={published ? 'success' : 'ghost'}>
      {published ? 'Published' : 'Draft'}
    </Badge>
  )
}

const LEAD_STATUS_VARIANT: Record<
  LeadStatus,
  'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'ghost'
> = {
  NEW: 'default',
  CONTACTED: 'warning',
  QUALIFIED: 'secondary',
  CLOSED: 'success',
  LOST: 'destructive',
}

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge variant={LEAD_STATUS_VARIANT[status]}>{humanizeEnum(status)}</Badge>
  )
}

export function RobotsBadge({ robots }: { robots: RobotsDirective }) {
  const noindex = robots.startsWith('NOINDEX')
  return (
    <Badge variant={noindex ? 'warning' : 'ghost'}>
      {robots.replace('_', ', ').toLowerCase()}
    </Badge>
  )
}

export function RatingStars({
  rating,
  className,
}: {
  rating: number
  className?: string
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-0.5', className)}
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            'size-3.5',
            i < rating
              ? 'fill-accent-orange text-accent-orange'
              : 'fill-muted text-muted-foreground/30',
          )}
        />
      ))}
    </span>
  )
}
