# Design Decisions & Assumptions

## Backend

### Architecture
- Clean layered architecture: routes → services → repository. Routes handle HTTP, services own business logic, repository handles DB I/O.
- `calculations.py` is a pure module (no DB, no HTTP) — easy to unit test in isolation.

### Data Model
- `calculated_at` is the business timestamp (included in the response model). `created_at` is added at the repo layer for MongoDB sort ordering.
- `building_id` is stored as a plain string. The assessment spec shows it as a hex string resembling a MongoDB ObjectId, but the spec does not require ObjectId validation — accepting any string gives more flexibility.
- Each POST creates a new calculation document. Historical data is preserved; the summary endpoint returns the most recent.

### Summary Endpoint
- Returns the most recent calculation document, not an aggregation across all historical submissions. This matches the typical dashboard use case where you want to see the latest state.

### Validation
- All energy/rate fields must be positive numbers (enforced via Pydantic `field_validator`).
- `period` must be one of `business_hours`, `after_hours`, or `weekend`.
- Empty `building_id` or `measure_name` will trigger Pydantic's standard required-field error (422 Unprocessable Entity).

### Error Handling
- MongoDB connection failures surface as 500 errors via FastAPI's default exception handling — no custom middleware needed at this scope.
- 400 for invalid input, 404 for not found, 422 for validation errors (Pydantic), 500 for unexpected server errors.

---

## Frontend

### Framework Choice: React + Vite
- Chose Vite over Create React App for faster dev startup and leaner output.
- Chose React (SPA) over Next.js because there is no need for SSR — this is a data dashboard, not a public-facing content site.

### State Management
- No global state library (Redux, Zustand, etc.) — `useState` in `App.tsx` via the `useEfficiency` hook is sufficient for this scope.

### Form Pre-fill
- The calculator form is pre-filled with the sample data from the assessment spec. This allows reviewers to click "Calculate Efficiency" immediately and see a working result without manual data entry.

### Chart Choice
- Recharts grouped `BarChart` comparing Electric %, Gas %, and Overall % per period. This directly answers "how did each energy type improve in each operational window?" — more informative than a single-metric chart.

### Color Coding
- Period breakdown rows: green background (≥20% overall), yellow (≥10%), red (<10%).
- Summary grade card: color maps A→green through F→red.

---

## Scope Decisions

The following were intentionally omitted as out of scope:
- Authentication / authorization
- Pagination (capped at 100 results per query — sufficient for a demo)
- Input sanitization beyond Pydantic validation
- Rate limiting
- Detailed logging / observability
