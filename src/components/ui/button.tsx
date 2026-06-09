import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted dark:bg-input/30 dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/30',
        link: 'text-primary underline-offset-4 hover:underline',
        accent:
          'bg-accent-orange text-accent-orange-foreground shadow-sm hover:bg-[color-mix(in_oklch,var(--accent-orange),black_8%)]',
      },
      size: {
        default: 'h-9 gap-1.5 px-3.5',
        sm: 'h-8 gap-1 rounded-md px-3 text-[0.8rem]',
        lg: 'h-10 gap-2 rounded-lg px-5 text-sm font-semibold',
        xl: "h-11 gap-2 rounded-xl px-6 text-base font-semibold [&_svg:not([class*='size-'])]:size-5",
        icon: 'size-9',
        'icon-sm': 'size-8 rounded-md',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
