import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, close_db
from routes.efficiency import router as efficiency_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Energy Efficiency Tracker API",
    version="1.0.0",
    lifespan=lifespan,
)

# In production set ALLOWED_ORIGINS env var to your frontend URL
# e.g. "https://your-app.onrender.com"
_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [o.strip() for o in _raw.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(efficiency_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
