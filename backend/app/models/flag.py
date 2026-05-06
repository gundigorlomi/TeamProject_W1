from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class RedFlag(Base):
    __tablename__ = "red_flags"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), index=True)
    severity: Mapped[str] = mapped_column(String(8))
    text: Mapped[str] = mapped_column(String(512))
    category: Mapped[str] = mapped_column(String(64), default="")

    scan = relationship("Scan", back_populates="red_flags")


class SuspiciousFollower(Base):
    __tablename__ = "suspicious_followers"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[int] = mapped_column(ForeignKey("scans.id"), index=True)
    handle: Mapped[str] = mapped_column(String(120))
    reason: Mapped[str] = mapped_column(String(255))
    bio: Mapped[str] = mapped_column(String(255), default="")
    followers: Mapped[int] = mapped_column(Integer, default=0)

    scan = relationship("Scan", back_populates="suspicious_followers")
