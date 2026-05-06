from datetime import datetime
from typing import Any

from pydantic import BaseModel

from app.schemas.influencer import InfluencerResponse


class ScanCreateRequest(BaseModel):
    influencer_id: int | None = None
    platform: str | None = None
    handle: str | None = None


class RedFlagItem(BaseModel):
    severity: str
    text: str
    category: str = ""

    model_config = {"from_attributes": True}


class SuspiciousFollowerItem(BaseModel):
    handle: str
    reason: str
    bio: str = ""
    followers: int = 0

    model_config = {"from_attributes": True}


class Subscores(BaseModel):
    follower_quality: int
    engagement_authenticity: int
    audience_content_fit: int
    growth_pattern: int


class CommentBreakdown(BaseModel):
    authentic: int
    generic: int
    spam: int


class TimelinePoint(BaseModel):
    day: int
    likes: int
    comments: int
    suspicious: bool = False


class ScanStatusResponse(BaseModel):
    id: int
    influencer_id: int
    status: str
    started_at: datetime
    finished_at: datetime | None = None
    error: str | None = None


class ScanResultResponse(BaseModel):
    id: int
    status: str
    influencer: InfluencerResponse
    score: int | None = None
    verdict: str | None = None
    confidence: float | None = None
    subscores: dict[str, int] | None = None
    comment_breakdown: dict[str, int] | None = None
    audience_demo: dict[str, Any] | None = None
    timeline: list[dict[str, Any]] | None = None
    red_flags: list[RedFlagItem] = []
    suspicious_followers: list[SuspiciousFollowerItem] = []
    started_at: datetime
    finished_at: datetime | None = None


class CompareResponse(BaseModel):
    a: ScanResultResponse
    b: ScanResultResponse
