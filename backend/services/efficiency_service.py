from datetime import datetime, timezone
from models import EfficiencyInput, EfficiencyResult
from calculations import calculate_period_metrics, calculate_summary
from repository import efficiency_repo


async def process_calculation(data: EfficiencyInput) -> EfficiencyResult:
    period_metrics = [calculate_period_metrics(p) for p in data.periods]
    summary = calculate_summary(period_metrics)

    result = EfficiencyResult(
        building_id=data.building_id,
        measure_name=data.measure_name,
        calculated_at=datetime.now(timezone.utc),
        periods=period_metrics,
        summary=summary,
    )

    doc = result.model_dump(exclude={"id"})
    saved = await efficiency_repo.insert_calculation(doc)
    result.id = saved["id"]
    return result


async def get_building_calculations(building_id: str):
    return await efficiency_repo.find_by_building(building_id)


async def get_period_calculations(building_id: str, period: str):
    return await efficiency_repo.find_by_building_and_period(building_id, period)


async def get_building_summary(building_id: str):
    return await efficiency_repo.get_latest_by_building(building_id)
