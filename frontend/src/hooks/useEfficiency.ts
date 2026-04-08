import { useState } from 'react'
import { api } from '../services/api'
import type { EfficiencyInput, EfficiencyResult } from '../types'

export function useEfficiency() {
  const [result, setResult] = useState<EfficiencyResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calculate = async (data: EfficiencyInput) => {
    setLoading(true)
    setError(null)
    try {
      setResult(await api.calculate(data))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation failed')
    } finally {
      setLoading(false)
    }
  }

  const loadBuilding = async (buildingId: string) => {
    setLoading(true)
    setError(null)
    try {
      setResult(await api.getSummary(buildingId))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load building data')
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, calculate, loadBuilding }
}
