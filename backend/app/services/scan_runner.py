"""Orchestrates scans: provider → scoring → DB persistence.

The runner is split into `prepare()` (synchronous, creates a queued Scan
row) and `execute()` (the actual work, intended to run from a background
task). This separation makes it easy to swap FastAPI BackgroundTasks for
a real worker queue (Celery / RQ) later.
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.flag import RedFlag, SuspiciousFollower
from app.models.influencer import Influencer
from app.models.scan import Scan
from app.providers.factory import resolve
from app.scoring.engine import run as run_scoring


def _normalize_handle(handle: str) -> str:
    h = handle.strip()
    if not h.startswith("@"):
        h = "@" + h
    return h.lower()


def get_or_create_influencer(
    db: Session, *, platform: str | None, handle: str
) -> Influencer:
    handle = _normalize_handle(handle)
    provider = resolve(platform, handle)
    platform = provider.platform

    existing = (
        db.query(Influencer)
        .filter(Influencer.platform == platform, Influencer.handle == handle)
        .one_or_none()
    )
    if existing:
        return existing

    data = provider.fetch(handle)
    p = data.profile
    inf = Influencer(
        platform=platform,
        handle=handle,
        name=p.name,
        niche=p.niche,
        avatar=p.avatar,
        avatar_hue=p.avatar_hue,
        verified=p.verified,
        followers=p.followers,
        following=p.following,
        posts=p.posts,
        account_age_days=p.account_age_days,
        location=p.location,
    )
    db.add(inf)
    db.commit()
    db.refresh(inf)
    return inf


def prepare(db: Session, *, influencer_id: int, user_id: int | None) -> Scan:
    scan = Scan(
        influencer_id=influencer_id,
        requested_by_user_id=user_id,
        status="queued",
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    return scan


def execute(db: Session, scan_id: int) -> None:
    scan = db.get(Scan, scan_id)
    if not scan:
        return
    inf = db.get(Influencer, scan.influencer_id)
    if not inf:
        scan.status = "failed"
        scan.error = "influencer not found"
        scan.finished_at = datetime.now(timezone.utc)
        db.commit()
        return

    scan.status = "running"
    db.commit()

    try:
        provider = resolve(inf.platform, inf.handle)
        data = provider.fetch(inf.handle)
        out = run_scoring(data)

        # Refresh influencer profile fields with the latest provider snapshot —
        # mock data is deterministic, but real providers will drift.
        inf.followers = data.profile.followers
        inf.following = data.profile.following
        inf.posts = data.profile.posts
        inf.last_scanned_at = datetime.now(timezone.utc)

        scan.score = out.score
        scan.verdict = out.verdict
        scan.confidence = out.confidence
        scan.subscores = out.subscores
        scan.comment_breakdown = out.comment_breakdown
        scan.audience_demo = out.audience_demo
        scan.timeline = out.timeline
        scan.status = "done"
        scan.finished_at = datetime.now(timezone.utc)

        for flag in out.flags:
            db.add(RedFlag(scan_id=scan.id, severity=flag.severity, text=flag.text, category=flag.category))
        for sf in out.suspicious_followers:
            db.add(SuspiciousFollower(
                scan_id=scan.id,
                handle=sf["handle"],
                reason=sf["reason"],
                bio=sf["bio"],
                followers=sf["followers"],
            ))
        db.commit()
    except Exception as e:  # noqa: BLE001
        db.rollback()
        scan.status = "failed"
        scan.error = str(e)[:500]
        scan.finished_at = datetime.now(timezone.utc)
        db.commit()
