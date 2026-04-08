import type { EfficiencyResult } from '../../types'
import { EfficiencyChart } from './EfficiencyChart'
import { PeriodBreakdown } from './PeriodBreakdown'
import { SummaryCards } from './SummaryCards'


interface Props {
  result: EfficiencyResult
}

export function EfficiencyDashboard({ result }: Props) {
  return (
    <section className="dashboard">
      <div className="dashboard-header">
        <h2>{result.measure_name}</h2>
        <span className="building-id">Building: {result.building_id}</span>
        <span className="timestamp">
          {new Date(result.calculated_at).toLocaleString()}
        </span>
      </div>
      <SummaryCards summary={result.summary} />
      <EfficiencyChart periods={result.periods} />
      <PeriodBreakdown periods={result.periods} />
    </section>
  )
}
