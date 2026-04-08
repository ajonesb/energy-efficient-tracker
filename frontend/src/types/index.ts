export type Period = 'business_hours' | 'after_hours' | 'weekend'

export interface PeriodInput {
  period: Period
  time_range: string
  days: string[]
  current_electric_kwh: number
  current_gas_therms: number
  baseline_electric_kwh: number
  baseline_gas_therms: number
  electric_rate: number
  gas_rate: number
}

export interface EfficiencyInput {
  building_id: string
  measure_name: string
  periods: PeriodInput[]
}

export interface PeriodMetrics {
  period: string
  time_range: string
  days: string[]
  electric_savings_kwh: number
  gas_savings_therms: number
  electric_cost_savings: number
  gas_cost_savings: number
  total_cost_savings: number
  electric_improvement_pct: number
  gas_improvement_pct: number
  overall_improvement_pct: number
}

export interface EfficiencySummary {
  total_electric_savings_kwh: number
  total_gas_savings_therms: number
  total_cost_savings: number
  avg_efficiency_improvement_pct: number
  performance_grade: string
}

export interface EfficiencyResult {
  id?: string
  building_id: string
  measure_name: string
  calculated_at: string
  periods: PeriodMetrics[]
  summary: EfficiencySummary
}
