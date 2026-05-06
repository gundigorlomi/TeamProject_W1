from dataclasses import dataclass, field
from typing import Any

from app.providers.base import ProviderData
from app.scoring import audience_fit, engagement, follower_quality, growth
from app.scoring.flags import Flag


# Weights match plan: follower 0.30, engagement 0.30, audience 0.20, growth 0.20
_WEIGHTS = {
    "follower_quality": 0.30,
    "engagement_authenticity": 0.30,
    "audience_content_fit": 0.20,
    "growth_pattern": 0.20,
}


@dataclass
class ScanOutput:
    score: int
    verdict: str
    confidence: float
    subscores: dict[str, int]
    flags: list[Flag]
    comment_breakdown: dict[str, int]
    audience_demo: dict[str, Any]
    timeline: list[dict[str, Any]]
    suspicious_followers: list[dict[str, Any]] = field(default_factory=list)


def _verdict(score: int) -> str:
    if score >= 75:
        return "Authentic"
    if score >= 45:
        return "Suspicious"
    return "Likely Fake"


def _suspicious_followers(data: ProviderData, limit: int = 8) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    seen: set[str] = set()
    for f in data.followers:
        if not f.is_generic_pattern and f.has_avatar and f.post_count > 0:
            continue
        if f.handle in seen:
            continue
        seen.add(f.handle)
        reason = (
            "No profile picture, no posts" if (not f.has_avatar and f.post_count == 0)
            else "No profile picture" if not f.has_avatar
            else "Account < 30 days old" if f.account_age_days < 30
            else "Follows 7,000+, has < 5 followers" if (f.following_count > 1000 and f.follower_count < 20)
            else "Generic username pattern"
        )
        out.append({
            "handle": f.handle,
            "reason": reason,
            "bio": f.bio,
            "followers": f.follower_count,
        })
        if len(out) >= limit:
            break
    return out


def run(data: ProviderData) -> ScanOutput:
    fq, fq_flags = follower_quality.score(data)
    eg, eg_flags = engagement.score(data)
    af, af_flags = audience_fit.score(data)
    gr, gr_flags = growth.score(data)

    subscores = {
        "follower_quality": fq,
        "engagement_authenticity": eg,
        "audience_content_fit": af,
        "growth_pattern": gr,
    }
    composite = (
        fq * _WEIGHTS["follower_quality"]
        + eg * _WEIGHTS["engagement_authenticity"]
        + af * _WEIGHTS["audience_content_fit"]
        + gr * _WEIGHTS["growth_pattern"]
    )
    score_v = int(round(composite))
    verdict = _verdict(score_v)

    all_flags = fq_flags + eg_flags + af_flags + gr_flags
    severity_rank = {"high": 0, "med": 1, "low": 2}
    all_flags.sort(key=lambda f: severity_rank.get(f.severity, 3))

    timeline = [
        {"day": p.day, "likes": p.likes, "comments": p.comments, "suspicious": p.is_spike}
        for p in data.posts
    ]
    audience_demo = {
        "ageGroups": data.audience.age_groups,
        "topCountries": data.audience.top_countries,
        "genderSplit": data.audience.gender_split,
    }
    confidence = round(0.82 + min(len(data.followers), 240) / 1500, 2)

    return ScanOutput(
        score=score_v,
        verdict=verdict,
        confidence=confidence,
        subscores=subscores,
        flags=all_flags,
        comment_breakdown=engagement.comment_breakdown(data),
        audience_demo=audience_demo,
        timeline=timeline,
        suspicious_followers=_suspicious_followers(data),
    )
