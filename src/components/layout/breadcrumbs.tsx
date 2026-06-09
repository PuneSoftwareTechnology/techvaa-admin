import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronRightIcon } from 'lucide-react'

import { humanizeEnum } from '@/lib/format'
import { NAV_ITEMS } from '@/constants/navigation'

const LABELS: Record<string, string> = {
  new: 'New',
  edit: 'Edit',
  ...Object.fromEntries(
    NAV_ITEMS.map((i) => [i.to.replace('/', ''), i.title]),
  ),
}

function labelFor(segment: string) {
  if (LABELS[segment]) return LABELS[segment]
  // ids / slugs -> show a trimmed, humanised form
  if (segment.length > 14) return `${segment.slice(0, 10)}…`
  return humanizeEnum(segment)
}

/** Derives a breadcrumb trail from the current pathname. */
export function Breadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="hidden min-w-0 sm:block">
      <ol className="flex items-center gap-1.5 text-sm">
        <li>
          <Link
            to="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </li>
        {segments.map((segment, i) => {
          const href = '/' + segments.slice(0, i + 1).join('/')
          const isLast = i === segments.length - 1
          return (
            <Fragment key={href}>
              <ChevronRightIcon className="size-3.5 shrink-0 text-muted-foreground/50" />
              <li className="min-w-0">
                {isLast ? (
                  <span className="truncate font-medium text-foreground">
                    {labelFor(segment)}
                  </span>
                ) : (
                  <Link
                    to={href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {labelFor(segment)}
                  </Link>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
