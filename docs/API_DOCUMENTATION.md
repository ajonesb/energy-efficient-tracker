# API Documentation

Base URL: `http://localhost:8000`

---

## POST /api/efficiency/calculate

Calculate and store energy efficiency metrics for a building.

**Status**: 201 Created

**Request Body:**
```json
{
  "building_id": "string",
  "measure_name": "string",
  "periods": [
    {
      "period": "business_hours | after_hours | weekend",
      "time_range": "string (e.g. 08:00-18:00)",
      "days": ["string"],
      "current_electric_kwh": number (> 0),
      "current_gas_therms": number (> 0),
      "baseline_electric_kwh": number (> 0),
      "baseline_gas_therms": number (> 0),
      "electric_rate": number (> 0),
      "gas_rate": number (> 0)
    }
  ]
}
```

**Response:**
```json
{
  "id": "string (MongoDB ObjectId)",
  "building_id": "string",
  "measure_name": "string",
  "calculated_at": "ISO 8601 timestamp",
  "periods": [
    {
      "period": "string",
      "time_range": "string",
      "days": ["string"],
      "electric_savings_kwh": number,
      "gas_savings_therms": number,
      "electric_cost_savings": number,
      "gas_cost_savings": number,
      "total_cost_savings": number,
      "electric_improvement_pct": number,
      "gas_improvement_pct": number,
      "overall_improvement_pct": number
    }
  ],
  "summary": {
    "total_electric_savings_kwh": number,
    "total_gas_savings_therms": number,
    "total_cost_savings": number,
    "avg_efficiency_improvement_pct": number,
    "performance_grade": "A | B | C | D | F"
  }
}
```

---

## GET /api/efficiency/building/{building_id}

Returns all calculations for a building, sorted newest first.

**Response:** Array of calculation objects (same structure as POST response).

**Errors:**
- `404` — No calculations found for this building ID.

---

## GET /api/efficiency/building/{building_id}/period/{period}

Returns calculations for a building filtered to those that include the specified period.

**Path params:** `period` must be `business_hours`, `after_hours`, or `weekend`.

**Errors:**
- `400` — Invalid period name.
- `404` — No matching calculations found.

---

## GET /api/efficiency/building/{building_id}/summary

Returns the most recent calculation for a building.

**Errors:**
- `404` — No calculations found for this building ID.

---

## Calculation Formulas

| Field | Formula |
|-------|---------|
| `electric_savings_kwh` | `baseline_electric_kwh − current_electric_kwh` |
| `gas_savings_therms` | `baseline_gas_therms − current_gas_therms` |
| `electric_cost_savings` | `electric_savings_kwh × electric_rate` |
| `gas_cost_savings` | `gas_savings_therms × gas_rate` |
| `total_cost_savings` | `electric_cost_savings + gas_cost_savings` |
| `electric_improvement_pct` | `(electric_savings / baseline_electric_kwh) × 100` |
| `gas_improvement_pct` | `(gas_savings / baseline_gas_therms) × 100` |
| `overall_improvement_pct` | `(electric_improvement_pct + gas_improvement_pct) / 2` |
| Summary totals | Sum across all periods |
| `avg_efficiency_improvement_pct` | Mean of all `overall_improvement_pct` values |

## Performance Grade Scale

| Grade | Condition |
|-------|-----------|
| A | avg_efficiency ≥ 20% |
| B | avg_efficiency ≥ 15% |
| C | avg_efficiency ≥ 10% |
| D | avg_efficiency ≥ 5% |
| F | avg_efficiency < 5% |
