from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import cracks

app = FastAPI(title="Construction Intelligence Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cracks.router)


@app.get("/health")
async def health_check():
    return {"status": "ok"}

