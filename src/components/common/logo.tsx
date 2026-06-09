import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'

/** Techvaa wordmark + glyph. `collapsed` hides the wordmark. */
export function Logo({
  collapsed = false,
  className,
}: {
  collapsed?: boolean
  className?: string
}) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2.5 font-heading', className)}
      aria-label="Techvaa Admin home"
    >
      <img
        src="/logo.png"
        alt="Techvaa"
        className={cn(
          'w-auto object-contain shrink-0',
          collapsed ? 'h-8' : 'h-10',
        )}
      />
    </Link>
  )
}
