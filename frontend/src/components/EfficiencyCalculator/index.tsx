import type { EfficiencyInput } from '../../types'
import { CalculatorForm } from './CalculatorForm'

interface Props {
  onCalculate: (data: EfficiencyInput) => Promise<void>
  loading: boolean
}

export function EfficiencyCalculator({ onCalculate, loading }: Props) {
  return (
    <section className="card section">
      <h2>Calculate Efficiency</h2>
      <CalculatorForm onSubmit={onCalculate} loading={loading} />
    </section>
  )
}
