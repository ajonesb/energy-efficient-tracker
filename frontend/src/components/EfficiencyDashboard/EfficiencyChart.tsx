import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { PeriodMetrics } from '../../types'

const PERIOD_LABELS: Record<string, string> = {
  business_hours: 'Business Hours',
  after_hours: 'After Hours',
  weekend: 'Weekend',
}

interface Props {
  periods: PeriodMetrics[]
}

export function EfficiencyChart({ periods }: Props) {
  const data = periods.map(p => ({
    name: PERIOD_LABELS[p.period] ?? p.period,
    'Electric (%)': p.electric_improvement_pct,
    'Gas (%)': p.gas_improvement_pct,
    'Overall (%)': p.overall_improvement_pct,
  }))

  return (
    <div className="card section">
      <h3>Efficiency Improvement by Period</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
          <Legend />
          <Bar dataKey="Electric (%)" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Gas (%)" fill="#f97316" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Overall (%)" fill="#16a34a" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
