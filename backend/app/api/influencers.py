from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import desc, or_
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models.influencer import Influencer
from app.models.scan import Scan
from app.models.user import User
from app.schemas.influencer import InfluencerResponse, InfluencerSearchItem


router = APIRouter(prefix="/influencers", tags=["influencers"])


@router.get("", response_model=list[InfluencerSearchItem])
def search(
    q: str | None = None,
    platform: str | None = None,
    limit: int = 20,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> list[InfluencerSearchItem]:
    query = db.query(Influencer)
    if platform:
        query = query.filter(Influencer.platform == platform)
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(or_(
            Influencer.handle.ilike(like),
            Influencer.name.ilike(like),
            Influencer.niche.ilike(like),
        ))
    rows = query.order_by(Influencer.followers.desc()).limit(limit).all()

    out: list[InfluencerSearchItem] = []
    for inf in rows:
        latest = (
            db.query(Scan)
            .filter(Scan.influencer_id == inf.id, Scan.status == "done")
            .order_by(desc(Scan.finished_at))
            .first()
        )
        item = InfluencerSearchItem.model_validate(inf)
        if latest:
            item.latest_score = latest.score
            item.latest_verdict = latest.verdict
        out.append(item)
    return out


@router.get("/{influencer_id}", response_model=InfluencerResponse)
def get_one(
    influencer_id: int,
    db: Session = Depends(get_db),
    _user: User = Depends(get_current_user),
) -> InfluencerResponse:
    inf = db.get(Influencer, influencer_id)
    if not inf:
        raise HTTPException(404, "influencer not found")
    return InfluencerResponse.model_validate(inf)
