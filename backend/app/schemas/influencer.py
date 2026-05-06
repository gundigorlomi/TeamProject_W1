from datetime import datetime

from pydantic import BaseModel


class InfluencerBase(BaseModel):
    platform: str
    handle: str
    name: str
    niche: str = ""
    avatar: str = ""
    avatar_hue: int = 220
    verified: bool = False
    followers: int = 0
    following: int = 0
    posts: int = 0
    account_age_days: int = 0
    location: str = ""


class InfluencerResponse(InfluencerBase):
    id: int
    last_scanned_at: datetime | None = None

    model_config = {"from_attributes": True}


class InfluencerSearchItem(InfluencerResponse):
    latest_score: int | None = None
    latest_verdict: str | None = None
