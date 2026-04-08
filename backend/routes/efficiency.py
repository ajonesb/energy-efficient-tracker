from fastapi import APIRouter, HTTPException
from models import EfficiencyInput
from services import efficiency_service

router = APIRouter(prefix="/api/efficiency", tags=["efficiency"])


@router.post("/calculate", status_code=201)
async def calculate(data: EfficiencyInput):
    return await efficiency_service.process_calculation(data)


@router.get("/building/{building_id}")
async def get_building(building_id: str):
    results = await efficiency_service.get_building_calculations(building_id)
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No calculations found for building '{building_id}'",
        )
    return results


@router.get("/building/{building_id}/period/{period}")
async def get_period(building_id: str, period: str):
    valid = {"business_hours", "after_hours", "weekend"}
    if period not in valid:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid period. Must be one of {sorted(valid)}",
        )
    results = await efficiency_service.get_period_calculations(building_id, period)
    if not results:
        raise HTTPException(
            status_code=404,
            detail=f"No '{period}' data found for building '{building_id}'",
        )
    return results


@router.get("/building/{building_id}/summary")
async def get_summary(building_id: str):
    result = await efficiency_service.get_building_summary(building_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No calculations found for building '{building_id}'",
        )
    return result
