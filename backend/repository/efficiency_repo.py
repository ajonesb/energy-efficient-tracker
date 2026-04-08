from datetime import datetime, timezone
from typing import List, Optional
from database import get_db


def _serialize(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


async def insert_calculation(data: dict) -> dict:
    data["created_at"] = datetime.now(timezone.utc)
    result = await get_db().efficiency_calculations.insert_one(data)
    data["id"] = str(result.inserted_id)
    data.pop("_id", None)
    return data


async def find_by_building(building_id: str) -> List[dict]:
    cursor = get_db().efficiency_calculations.find(
        {"building_id": building_id}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    return [_serialize(d) for d in docs]


async def find_by_building_and_period(building_id: str, period: str) -> List[dict]:
    cursor = get_db().efficiency_calculations.find(
        {"building_id": building_id, "periods.period": period}
    ).sort("created_at", -1)
    docs = await cursor.to_list(length=100)
    return [_serialize(d) for d in docs]


async def get_latest_by_building(building_id: str) -> Optional[dict]:
    doc = await get_db().efficiency_calculations.find_one(
        {"building_id": building_id},
        sort=[("created_at", -1)],
    )
    return _serialize(doc) if doc else None
