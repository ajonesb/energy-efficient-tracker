import type { PeriodMetrics } from '../../types'

const PERIOD_LABELS: Record<string, string> = {
  business_hours: 'Business Hours',
  after_hours: 'After Hours',
  weekend: 'Weekend',
}

function perfColor(pct: number): string {
  if (pct >= 20) return '#f0fdf4'
  if (pct >= 10) return '#fefce8'
  return '#fef2f2'
}

function perfLabel(pct: number): string {
  if (pct >= 20) return 'Excellent'
  if (pct >= 10) return 'Good'
  return 'Needs Improvement'
}

interface Props {
  periods: PeriodMetrics[]
}

export function PeriodBreakdown({ periods }: Props) {
  return (
    <div className="card section">
      <h3>Period Breakdown</h3>
      <div className="breakdown-table-wrapper">
        <table className="breakdown-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Elec. Savings (kWh)</th>
              <th>Gas Savings (therms)</th>
              <th>Cost Savings ($)</th>
              <th>Elec. Imp.</th>
              <th>Gas Imp.</th>
              <th>Overall</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {periods.map(p => (
              <tr
                key={p.period}
                style={{ backgroundColor: perfColor(p.overall_improvement_pct) }}
              >
                <td>
                  <strong>{PERIOD_LABELS[p.period] ?? p.period}</strong>
                </td>
                <td>{p.electric_savings_kwh.toLocaleString()}</td>
                <td>{p.gas_savings_therms.toLocaleString()}</td>
                <td>
                  ${p.total_cost_savings.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td>{p.electric_improvement_pct.toFixed(1)}%</td>
                <td>{p.gas_improvement_pct.toFixed(1)}%</td>
                <td>
                  <strong>{p.overall_improvement_pct.toFixed(1)}%</strong>
                </td>
                <td>{perfLabel(p.overall_improvement_pct)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
