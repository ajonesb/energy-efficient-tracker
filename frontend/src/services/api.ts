import type { EfficiencyInput, EfficiencyResult } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, options)
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail ?? `HTTP ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  calculate: (data: EfficiencyInput) =>
    request<EfficiencyResult>('/api/efficiency/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  getBuilding: (buildingId: string) =>
    request<EfficiencyResult[]>(`/api/efficiency/building/${buildingId}`),

  getSummary: (buildingId: string) =>
    request<EfficiencyResult>(`/api/efficiency/building/${buildingId}/summary`),
}
