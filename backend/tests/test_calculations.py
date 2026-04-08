import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from calculations import calculate_period_metrics, calculate_summary, get_performance_grade
from models import PeriodInput


def make_period(**kwargs):
    defaults = dict(
        period="business_hours",
        time_range="08:00-18:00",
        days=["Monday"],
        current_electric_kwh=45000,
        current_gas_therms=3200,
        baseline_electric_kwh=52000,
        baseline_gas_therms=4100,
        electric_rate=0.12,
        gas_rate=0.95,
    )
    return PeriodInput(**{**defaults, **kwargs})


class TestPeriodMetrics:
    def test_electric_savings(self):
        m = calculate_period_metrics(make_period())
        assert m.electric_savings_kwh == 7000.0

    def test_gas_savings(self):
        m = calculate_period_metrics(make_period())
        assert m.gas_savings_therms == 900.0

    def test_cost_savings(self):
        m = calculate_period_metrics(make_period())
        assert m.electric_cost_savings == 840.0
        assert m.gas_cost_savings == 855.0
        assert m.total_cost_savings == 1695.0

    def test_improvement_percentages(self):
        m = calculate_period_metrics(make_period())
        assert abs(m.electric_improvement_pct - 13.46) < 0.01
        assert abs(m.gas_improvement_pct - 21.95) < 0.01
        assert abs(m.overall_improvement_pct - 17.71) < 0.01


class TestPerformanceGrade:
    def test_grade_a(self):
        assert get_performance_grade(20.0) == "A"
        assert get_performance_grade(25.0) == "A"

    def test_grade_b(self):
        assert get_performance_grade(15.0) == "B"
        assert get_performance_grade(19.9) == "B"

    def test_grade_c(self):
        assert get_performance_grade(10.0) == "C"
        assert get_performance_grade(14.9) == "C"

    def test_grade_d(self):
        assert get_performance_grade(5.0) == "D"
        assert get_performance_grade(9.9) == "D"

    def test_grade_f(self):
        assert get_performance_grade(0.0) == "F"
        assert get_performance_grade(4.9) == "F"


class TestSummaryAggregation:
    def test_full_sample_data(self):
        periods = [
            make_period(
                period="business_hours",
                current_electric_kwh=45000, current_gas_therms=3200,
                baseline_electric_kwh=52000, baseline_gas_therms=4100,
                electric_rate=0.12, gas_rate=0.95,
            ),
            make_period(
                period="after_hours",
                current_electric_kwh=28000, current_gas_therms=2200,
                baseline_electric_kwh=35000, baseline_gas_therms=2800,
                electric_rate=0.08, gas_rate=0.95,
            ),
            make_period(
                period="weekend",
                current_electric_kwh=15000, current_gas_therms=1200,
                baseline_electric_kwh=20000, baseline_gas_therms=1600,
                electric_rate=0.10, gas_rate=0.95,
            ),
        ]
        metrics = [calculate_period_metrics(p) for p in periods]
        summary = calculate_summary(metrics)

        assert summary.total_electric_savings_kwh == 19000.0
        assert summary.total_gas_savings_therms == 1900.0
        assert summary.total_cost_savings == 3705.0
        assert summary.performance_grade == "A"
