import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import type { CourseInterestPoint } from '../types'
import { ChartTooltip } from './chart-tooltip'

export function CourseInterestChart({ data }: { data: CourseInterestPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 8, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="course"
          width={110}
          tickLine={false}
          axisLine={false}
          tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--muted)' }} />
        <Bar
          dataKey="count"
          fill="var(--chart-2)"
          radius={[0, 6, 6, 0]}
          barSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
