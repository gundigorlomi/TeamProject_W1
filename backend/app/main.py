from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth as auth_router
from app.api import influencers as influencers_router
from app.api import scans as scans_router
from app.config import settings
from app.db import Base, SessionLocal, engine
from app.models import *  # noqa: F401, F403  — register tables on Base.metadata
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Veracity · Influencer Authenticity API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(influencers_router.router)
app.include_router(scans_router.router)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
