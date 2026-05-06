from datetime import datetime, timezone
from typing import Any

from sqlalchemy import JSON, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Scan(Base):
    __tablename__ = "scans"

    id: Mapped[int] = mapped_column(primary_key=True)
    influencer_id: Mapped[int] = mapped_column(ForeignKey("influencers.id"), index=True)
    requested_by_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    status: Mapped[str] = mapped_column(String(16), default="queued", index=True)
    score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    verdict: Mapped[str | None] = mapped_column(String(32), nullable=True)
    confidence: Mapped[float | None] = mapped_column(Float, nullable=True)

    subscores: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    comment_breakdown: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    audience_demo: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    timeline: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error: Mapped[str | None] = mapped_column(String(512), nullable=True)

    red_flags: Mapped[list["RedFlag"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="scan", cascade="all, delete-orphan"
    )
    suspicious_followers: Mapped[list["SuspiciousFollower"]] = relationship(  # type: ignore[name-defined]  # noqa: F821
        back_populates="scan", cascade="all, delete-orphan"
    )
