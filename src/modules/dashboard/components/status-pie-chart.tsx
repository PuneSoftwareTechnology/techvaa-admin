import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { LeadStatusPoint } from '../types'
import { ChartTooltip } from './chart-tooltip'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function StatusPieChart({ data }: { data: LeadStatusPoint[] }) {
  return (
    <div className="flex h-full flex-col gap-2 sm:flex-row sm:items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
            stroke="var(--card)"
            strokeWidth={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <ul className="grid shrink-0 grid-cols-1 gap-1.5 sm:w-40">
        {data.map((entry, i) => (
          <li
            key={entry.status}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="flex min-w-0 items-center gap-1.5 text-muted-foreground">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
              />
              <span className="truncate">{entry.label}</span>
            </span>
            <span className="font-medium text-foreground">{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
