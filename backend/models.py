from __future__ import annotations
from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime


class PeriodInput(BaseModel):
    period: str
    time_range: str
    days: List[str]
    current_electric_kwh: float
    current_gas_therms: float
    baseline_electric_kwh: float
    baseline_gas_therms: float
    electric_rate: float
    gas_rate: float

    @field_validator("period")
    @classmethod
    def validate_period(cls, v: str) -> str:
        valid = {"business_hours", "after_hours", "weekend"}
        if v not in valid:
            raise ValueError(f"period must be one of {sorted(valid)}")
        return v

    @field_validator(
        "current_electric_kwh",
        "current_gas_therms",
        "baseline_electric_kwh",
        "baseline_gas_therms",
        "electric_rate",
        "gas_rate",
    )
    @classmethod
    def validate_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("value must be positive")
        return v


class EfficiencyInput(BaseModel):
    building_id: str
    measure_name: str
    periods: List[PeriodInput]


class PeriodMetrics(BaseModel):
    period: str
    time_range: str
    days: List[str]
    electric_savings_kwh: float
    gas_savings_therms: float
    electric_cost_savings: float
    gas_cost_savings: float
    total_cost_savings: float
    electric_improvement_pct: float
    gas_improvement_pct: float
    overall_improvement_pct: float


class EfficiencySummary(BaseModel):
    total_electric_savings_kwh: float
    total_gas_savings_therms: float
    total_cost_savings: float
    avg_efficiency_improvement_pct: float
    performance_grade: str


class EfficiencyResult(BaseModel):
    id: Optional[str] = None
    building_id: str
    measure_name: str
    calculated_at: datetime
    periods: List[PeriodMetrics]
    summary: EfficiencySummary
