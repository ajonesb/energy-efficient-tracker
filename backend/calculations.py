from typing import List
from models import PeriodInput, PeriodMetrics, EfficiencySummary


def calculate_period_metrics(period: PeriodInput) -> PeriodMetrics:
    electric_savings = period.baseline_electric_kwh - period.current_electric_kwh
    gas_savings = period.baseline_gas_therms - period.current_gas_therms

    electric_cost_savings = electric_savings * period.electric_rate
    gas_cost_savings = gas_savings * period.gas_rate

    electric_improvement_pct = (electric_savings / period.baseline_electric_kwh) * 100
    gas_improvement_pct = (gas_savings / period.baseline_gas_therms) * 100
    overall_improvement_pct = (electric_improvement_pct + gas_improvement_pct) / 2

    return PeriodMetrics(
        period=period.period,
        time_range=period.time_range,
        days=period.days,
        electric_savings_kwh=round(electric_savings, 2),
        gas_savings_therms=round(gas_savings, 2),
        electric_cost_savings=round(electric_cost_savings, 2),
        gas_cost_savings=round(gas_cost_savings, 2),
        total_cost_savings=round(electric_cost_savings + gas_cost_savings, 2),
        electric_improvement_pct=round(electric_improvement_pct, 2),
        gas_improvement_pct=round(gas_improvement_pct, 2),
        overall_improvement_pct=round(overall_improvement_pct, 2),
    )


def get_performance_grade(avg_improvement_pct: float) -> str:
    if avg_improvement_pct >= 20:
        return "A"
    elif avg_improvement_pct >= 15:
        return "B"
    elif avg_improvement_pct >= 10:
        return "C"
    elif avg_improvement_pct >= 5:
        return "D"
    return "F"


def calculate_summary(period_metrics: List[PeriodMetrics]) -> EfficiencySummary:
    total_electric = sum(p.electric_savings_kwh for p in period_metrics)
    total_gas = sum(p.gas_savings_therms for p in period_metrics)
    total_cost = sum(p.total_cost_savings for p in period_metrics)
    avg_improvement = sum(p.overall_improvement_pct for p in period_metrics) / len(period_metrics)

    return EfficiencySummary(
        total_electric_savings_kwh=round(total_electric, 2),
        total_gas_savings_therms=round(total_gas, 2),
        total_cost_savings=round(total_cost, 2),
        avg_efficiency_improvement_pct=round(avg_improvement, 2),
        performance_grade=get_performance_grade(avg_improvement),
    )
