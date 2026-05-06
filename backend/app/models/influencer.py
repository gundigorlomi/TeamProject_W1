from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Influencer(Base):
    __tablename__ = "influencers"
    __table_args__ = (UniqueConstraint("platform", "handle", name="uq_platform_handle"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    platform: Mapped[str] = mapped_column(String(32), index=True)
    handle: Mapped[str] = mapped_column(String(120), index=True)
    name: Mapped[str] = mapped_column(String(120))
    niche: Mapped[str] = mapped_column(String(120), default="")
    avatar: Mapped[str] = mapped_column(String(8), default="")
    avatar_hue: Mapped[int] = mapped_column(Integer, default=220)
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    followers: Mapped[int] = mapped_column(Integer, default=0)
    following: Mapped[int] = mapped_column(Integer, default=0)
    posts: Mapped[int] = mapped_column(Integer, default=0)
    account_age_days: Mapped[int] = mapped_column(Integer, default=0)
    location: Mapped[str] = mapped_column(String(120), default="")
    last_scanned_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
