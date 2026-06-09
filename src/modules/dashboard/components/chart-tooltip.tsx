interface TooltipEntry {
  value?: number | string
  name?: string | number
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  label?: string | number
  payload?: TooltipEntry[]
}

/** Themed tooltip shared by all dashboard charts. */
export function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-popover px-3 py-2 text-xs shadow-md ring-1 ring-foreground/10">
      {label !== undefined && (
        <p className="mb-1 font-medium text-foreground">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-1.5 text-muted-foreground">
          <span
            className="size-2 rounded-full"
            style={{ background: entry.color ?? 'var(--chart-1)' }}
          />
          <span className="font-medium text-foreground">{entry.value}</span>
          {entry.name && <span>{entry.name}</span>}
        </p>
      ))}
    </div>
  )
}
