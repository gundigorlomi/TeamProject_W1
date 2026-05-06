"""On first boot, seed the DB with the three prototype influencers and
synchronously run a scan on each so the dashboard has data to render
without forcing a fresh scan from the UI.
"""

from sqlalchemy.orm import Session

from app.models.user import User
from app.providers.fixtures import FIXTURES
from app.services import scan_runner
from app.services.auth import hash_password


def _seed_admin(db: Session) -> None:
    if db.query(User).filter(User.email == "admin").one_or_none():
        return
    db.add(User(
        email="admin",
        password_hash=hash_password("admin"),
        agency_name="Veracity Demo",
        role="admin",
    ))
    db.commit()


def seed_if_empty(db: Session) -> None:
    from app.models.influencer import Influencer

    _seed_admin(db)

    if db.query(Influencer).first():
        return

    for handle in FIXTURES.keys():
        inf = scan_runner.get_or_create_influencer(db, platform=None, handle=handle)
        scan = scan_runner.prepare(db, influencer_id=inf.id, user_id=None)
        scan_runner.execute(db, scan.id)
