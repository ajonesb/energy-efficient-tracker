# Energy Efficiency Tracker

A full-stack application for tracking energy efficiency improvements across building operational periods.

## Tech Stack

- **Backend**: FastAPI (Python 3.11) + Motor (async MongoDB driver)
- **Database**: MongoDB
- **Frontend**: React 18 + TypeScript + Vite
- **Charts**: Recharts

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- MongoDB running locally (`mongod`)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit if needed
uvicorn main:app --reload --port 8000
```

- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

- App: http://localhost:5173

### Docker (full stack)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## Environment Variables

**`backend/.env`**
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=energy_tracker
```

**`frontend/.env`** (optional — defaults to localhost:8000)
```
VITE_API_URL=http://localhost:8000
```

## Running Tests

```bash
cd backend
pytest tests/ -v
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/efficiency/calculate` | Calculate & store efficiency metrics |
| GET | `/api/efficiency/building/{id}` | All calculations for a building |
| GET | `/api/efficiency/building/{id}/period/{period}` | Filter by period |
| GET | `/api/efficiency/building/{id}/summary` | Latest calculation summary |

## Sample Request

```bash
curl -X POST http://localhost:8000/api/efficiency/calculate \
  -H "Content-Type: application/json" \
  -d '{
    "building_id": "507f1f77bcf86cd799439011",
    "measure_name": "Smart HVAC System Upgrade",
    "periods": [
      {
        "period": "business_hours",
        "time_range": "08:00-18:00",
        "days": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "current_electric_kwh": 45000,
        "current_gas_therms": 3200,
        "baseline_electric_kwh": 52000,
        "baseline_gas_therms": 4100,
        "electric_rate": 0.12,
        "gas_rate": 0.95
      },
      {
        "period": "after_hours",
        "time_range": "18:00-08:00",
        "days": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "current_electric_kwh": 28000,
        "current_gas_therms": 2200,
        "baseline_electric_kwh": 35000,
        "baseline_gas_therms": 2800,
        "electric_rate": 0.08,
        "gas_rate": 0.95
      },
      {
        "period": "weekend",
        "time_range": "00:00-24:00",
        "days": ["Saturday","Sunday"],
        "current_electric_kwh": 15000,
        "current_gas_therms": 1200,
        "baseline_electric_kwh": 20000,
        "baseline_gas_therms": 1600,
        "electric_rate": 0.10,
        "gas_rate": 0.95
      }
    ]
  }'
```

## Calculation Logic

| Metric | Formula |
|--------|---------|
| Electric Savings | `baseline_kwh − current_kwh` |
| Gas Savings | `baseline_therms − current_therms` |
| Electric Cost Savings | `electric_savings × electric_rate` |
| Gas Cost Savings | `gas_savings × gas_rate` |
| Electric Improvement % | `(electric_savings / baseline_kwh) × 100` |
| Gas Improvement % | `(gas_savings / baseline_therms) × 100` |
| Overall Improvement % | `avg(electric_%, gas_%)` |

**Performance Grade**: Based on average overall improvement across all periods — A (≥20%), B (≥15%), C (≥10%), D (≥5%), F (<5%).

## Approach

Focused on clarity and functionality given time constraints.

- **Backend**: Clean layered architecture (routes → services → repository). Pure calculation functions in `calculations.py` make them independently testable without any DB or HTTP setup.
- **Frontend**: `useEfficiency` hook owns all async state. Components are purely presentational. Form is pre-filled with the assessment's sample data so reviewers can submit immediately.
- **No overengineering**: No auth, no pagination, no global state manager — just what the spec requires.

<img width="1857" height="991" alt="image" src="https://github.com/user-attachments/assets/60ff63ff-45c0-47a4-a556-e6c4d56782a3" />
<img width="1857" height="991" alt="image" src="https://github.com/user-attachments/assets/5ac523d8-5d7b-492a-99f8-0fbc45b12eac" />



<img width="1894" height="1007" alt="image" src="https://github.com/user-attachments/assets/fdd2e478-357b-4ea9-8818-26bd1af71c52" />

<img width="1857" height="991" alt="image" src="https://github.com/user-attachments/assets/746b695d-7394-4794-a3cb-2445d029a922" />



<img width="1903" height="424" alt="image" src="https://github.com/user-attachments/assets/5b9b5b4e-1e65-4b7e-8c25-ab15d4f1916c" />

<img width="1894" height="1007" alt="image" src="https://github.com/user-attachments/assets/dcadbea5-2c9c-483e-b142-1ed6d5f31402" />

<img width="1894" height="1007" alt="image" src="https://github.com/user-attachments/assets/298109f5-9106-4b83-969a-4a68d9633f6d" />

<img width="1857" height="991" alt="image" src="https://github.com/user-attachments/assets/1d1e7428-bb1b-41a4-b8c6-48ca8ecac1e0" />




## Demo
https://energy-efficient-tracker-1.onrender.com/



