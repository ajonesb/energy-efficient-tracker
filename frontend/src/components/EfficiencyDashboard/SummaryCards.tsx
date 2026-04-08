import type { EfficiencySummary } from '../../types'

const GRADE_COLORS: Record<string, string> = {
  A: '#16a34a',
  B: '#65a30d',
  C: '#ca8a04',
  D: '#d97706',
  F: '#dc2626',
}

interface Props {
  summary: EfficiencySummary
}

export function SummaryCards({ summary }: Props) {
  const gradeColor = GRADE_COLORS[summary.performance_grade] ?? '#6b7280'

  return (
    <div className="summary-cards">
      <div className="metric-card">
        <div className="metric-value">
          ${summary.total_cost_savings.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <div className="metric-label">Total Cost Savings</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">
          {summary.total_electric_savings_kwh.toLocaleString()}
        </div>
        <div className="metric-label">Electric Savings (kWh)</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">
          {summary.total_gas_savings_therms.toLocaleString()}
        </div>
        <div className="metric-label">Gas Savings (therms)</div>
      </div>

      <div className="metric-card">
        <div className="metric-value">
          {summary.avg_efficiency_improvement_pct.toFixed(1)}%
        </div>
        <div className="metric-label">Avg. Efficiency Gain</div>
      </div>

      <div className="metric-card">
        <div className="metric-value grade" style={{ color: gradeColor }}>
          {summary.performance_grade}
        </div>
        <div className="metric-label">Performance Grade</div>
      </div>
    </div>
  )
}
