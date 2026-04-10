import { useState, type FormEvent } from 'react'
import type { EfficiencyInput } from '../../types'
import { PeriodInput } from './PeriodInput'

const DEFAULT_FORM: EfficiencyInput = {
  building_id: '507f1f77bcf86cd799439011',
  measure_name: 'Smart HVAC System Upgrade',
  periods: [
    {
      period: 'business_hours',
      time_range: '08:00-18:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      current_electric_kwh: 45000,
      current_gas_therms: 3200,
      baseline_electric_kwh: 52000,
      baseline_gas_therms: 4100,
      electric_rate: 0.12,
      gas_rate: 0.95,
    },
    {
      period: 'after_hours',
      time_range: '18:00-08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      current_electric_kwh: 28000,
      current_gas_therms: 2200,
      baseline_electric_kwh: 35000,
      baseline_gas_therms: 2800,
      electric_rate: 0.08,
      gas_rate: 0.95,
    },
    {
      period: 'weekend',
      time_range: '00:00-24:00',
      days: ['Saturday', 'Sunday'],
      current_electric_kwh: 15000,
      current_gas_therms: 1200,
      baseline_electric_kwh: 20000,
      baseline_gas_therms: 1600,
      electric_rate: 0.1,
      gas_rate: 0.95,
    },
  ],
}

interface Props {
  onSubmit: (data: EfficiencyInput) => Promise<void>
  loading: boolean
}

export function CalculatorForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<EfficiencyInput>(DEFAULT_FORM)

  const updatePeriod = (index: number, updated: EfficiencyInput['periods'][number]) =>
    setForm(f => {
      const periods = [...f.periods]
      periods[index] = updated
      return { ...f, periods }
    })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-field">
          <label>Building ID</label>
          <input
            type="text"
            value={form.building_id}
            onChange={e => setForm(f => ({ ...f, building_id: e.target.value }))}
            required
          />
        </div>
        <div className="form-field">
          <label>Measure Name</label>
          <input
            type="text"
            value={form.measure_name}
            onChange={e => setForm(f => ({ ...f, measure_name: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="periods-grid">
        {form.periods.map((period, i) => (
          <PeriodInput
            key={period.period}
            data={period}
            onChange={updated => updatePeriod(i, updated)}
          />
        ))}
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate Efficiency'}
      </button>
    </form>
  )
}
