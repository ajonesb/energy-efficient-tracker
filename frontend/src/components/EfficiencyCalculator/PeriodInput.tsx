import type { PeriodInput as PeriodData } from '../../types'

const PERIOD_LABELS: Record<string, string> = {
  business_hours: 'Business Hours',
  after_hours: 'After Hours',
  weekend: 'Weekend',
}

type NumericField =
  | 'current_electric_kwh'
  | 'current_gas_therms'
  | 'baseline_electric_kwh'
  | 'baseline_gas_therms'
  | 'electric_rate'
  | 'gas_rate'

interface Props {
  data: PeriodData
  onChange: (updated: PeriodData) => void
}

export function PeriodInput({ data, onChange }: Props) {
  const update = (field: NumericField, value: number) =>
    onChange({ ...data, [field]: value })

  const numField = (label: string, field: NumericField, unit: string) => (
    <div className="form-field">
      <label>
        {label} <span className="unit">({unit})</span>
      </label>
      <input
        type="number"
        min="0"
        step="any"
        value={data[field]}
        onChange={e => update(field, parseFloat(e.target.value) || 0)}
        required
      />
    </div>
  )

  return (
    <div className="period-section">
      <div className="period-title">{PERIOD_LABELS[data.period] ?? data.period}</div>
      <div className="period-meta">
        <span>{data.time_range}</span>
        <span>{data.days.join(', ')}</span>
      </div>
      <div className="fields-grid">
        <div className="field-group">
          <h4>Current</h4>
          {numField('Electric', 'current_electric_kwh', 'kWh')}
          {numField('Gas', 'current_gas_therms', 'therms')}
        </div>
        <div className="field-group">
          <h4>Baseline</h4>
          {numField('Electric', 'baseline_electric_kwh', 'kWh')}
          {numField('Gas', 'baseline_gas_therms', 'therms')}
        </div>
        <div className="field-group">
          <h4>Rates</h4>
          {numField('Electric', 'electric_rate', '$/kWh')}
          {numField('Gas', 'gas_rate', '$/therm')}
        </div>
      </div>
    </div>
  )
}
