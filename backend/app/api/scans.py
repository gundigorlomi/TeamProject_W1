from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import SessionLocal, get_db
from app.models.influencer import Influencer
from app.models.scan import Scan
from app.models.user import User
from app.schemas.influencer import InfluencerResponse
from app.schemas.scan import (
    CompareResponse,
    RedFlagItem,
    ScanCreateRequest,
    ScanResultResponse,
    ScanStatusResponse,
    SuspiciousFollowerItem,
)
from app.services import scan_runner


router = APIRouter(prefix="/scans", tags=["scans"])


def _execute_in_new_session(scan_id: int) -> None:
    db = SessionLocal()
    try:
        scan_runner.execute(db, scan_id)
    finally:
        db.close()


def _to_result(db: Session, scan: Scan) -> ScanResultResponse:
    inf = db.get(Influencer, scan.influencer_id)
    return ScanResultResponse(
        id=scan.id,
        status=scan.status,
        influencer=InfluencerResponse.model_validate(inf),
        score=scan.score,
        verdict=scan.verdict,
        confidence=scan.confidence,
        subscores=scan.subscores,
        comment_breakdown=scan.comment_breakdown,
        audience_demo=scan.audience_demo,
        timeline=scan.timeline,
        red_flags=[RedFlagItem.model_validate(f) for f in scan.red_flags],
        suspicious_followers=[SuspiciousFollowerItem.model_validate(f) for f in scan.suspicious_followers],
        started_at=scan.started_at,
        finished_at=scan.finished_at,
    )


@router.post("", response_model=ScanStatusResponse, status_code=202)
def create(
    req: ScanCreateRequest,
    background: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
) -> ScanStatusResponse:
    if not req.influencer_id and not (req.handle and req.platform):
        # platform optional — fixtures can resolve it
        if not req.handle:
            raise HTTPException(400, "provide influencer_id or handle")

    if req.influencer_id:
        inf = db.get(Influencer, req.influencer_id)
        if not inf:
            raise HTTPException(404, "influencer not found")
    else:
        inf = scan_runner.get_or_create_influencer(db, platform=req.platform, handle=req.handle or "")

    scan = scan_runner.prepare(db, influencer_id=inf.id, user_id=user.id)
    background.add_task(_execute_in_new_session, scan.id)
    return ScanStatusResponse(
        id=scan.id,
        influencer_id=scan.influencer_id,
        status=scan.status,
        started_at=scan.started_at,
        finished_at=scan.finished_at,
        error=scan.error,
    )


@router.get("/compare", response_model=CompareResponse)
def compare(
    a: int,
    b: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> CompareResponse:
    sa = db.get(Scan, a)
    sb = db.get(Scan, b)
    if not sa or not sb:
        raise HTTPException(404, "scan not found")
    return CompareResponse(a=_to_result(db, sa), b=_to_result(db, sb))


@router.get("/by-influencer/{influencer_id}/latest", response_model=ScanResultResponse)
def latest_for_influencer(
    influencer_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> ScanResultResponse:
    inf = db.get(Influencer, influencer_id)
    if not inf:
        raise HTTPException(404, "influencer not found")
    scan = (
        db.query(Scan)
        .filter(Scan.influencer_id == influencer_id, Scan.status == "done")
        .order_by(desc(Scan.finished_at))
        .first()
    )
    if not scan:
        raise HTTPException(404, "no completed scan yet")
    return _to_result(db, scan)


@router.get("/{scan_id}", response_model=ScanResultResponse)
def get_one(
    scan_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> ScanResultResponse:
    scan = db.get(Scan, scan_id)
    if not scan:
        raise HTTPException(404, "scan not found")
    return _to_result(db, scan)
