import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { MonthlyLeadsPoint } from '../types'
import { ChartTooltip } from './chart-tooltip'

export function LeadsAreaChart({ data }: { data: MonthlyLeadsPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
          width={32}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--border)' }} />
        <Area
          type="monotone"
          dataKey="leads"
          stroke="var(--chart-1)"
          strokeWidth={2}
          fill="url(#leadsFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
