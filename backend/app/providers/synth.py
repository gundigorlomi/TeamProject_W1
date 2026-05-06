"""Deterministic synthesis of provider data from a handle.

The same handle always produces the same data. The `authenticity_level`
(0..1) controls how clean or sketchy the resulting follower / post /
comment sample looks. Fixtures pin specific levels; unknown handles get
a hash-derived level, with simple pattern bumps (e.g. 'fake', 'bot',
'_xx', random number suffixes).
"""

from __future__ import annotations

import hashlib
import random
import re

from app.providers.base import (
    AudienceSample,
    CommentSample,
    FollowerSample,
    PostSample,
    ProfileData,
    ProviderData,
)
from app.providers.fixtures import fixture_for


_NICHE_BANK = {
    "instagram": ["Architecture & Interiors", "Lifestyle", "Beauty & Skincare", "Travel", "Food"],
    "tiktok": ["Fitness & Wellness", "Comedy", "Dance", "Tech & Gadgets", "DIY"],
}
_LOCATIONS = ["Brooklyn, NY", "Miami, FL", "Los Angeles, CA", "Austin, TX", "London, UK", "Toronto, CA"]
_NAMES_FIRST = ["Avery", "Kai", "Riley", "Sky", "Jordan", "Quinn", "Sage", "River", "Ash", "Harper"]
_NAMES_LAST = ["Reyes", "Carter", "Morgan", "Bailey", "Hart", "Vance", "Cole", "West", "Lane", "Knox"]


def _seed(handle: str) -> int:
    h = hashlib.sha256(handle.lower().encode("utf-8")).digest()
    return int.from_bytes(h[:8], "big")


def _derive_authenticity(handle: str) -> float:
    rng = random.Random(_seed(handle) ^ 0xA17C)
    base = 0.45 + rng.random() * 0.45
    h = handle.lower()
    if any(tag in h for tag in ("fake", "bot", "_xx", "scam", "spam")):
        base -= 0.35
    if re.search(r"\d{4,}", h) or h.startswith("@user_"):
        base -= 0.15
    if "." in h.replace("@", "") and any(w in h for w in ("daily", "official", "real")):
        base -= 0.1
    if h.count(".") >= 2:
        base -= 0.05
    return max(0.05, min(0.95, base))


def _platform_default(handle: str, platform: str | None) -> str:
    if platform:
        return platform
    rng = random.Random(_seed(handle) ^ 0xBEE)
    return "instagram" if rng.random() < 0.55 else "tiktok"


def _fmt_avatar(name: str) -> str:
    parts = [p for p in re.split(r"[\s.]+", name) if p]
    if len(parts) >= 2:
        return (parts[0][0] + parts[1][0]).upper()
    return (parts[0][:2] if parts else "??").upper()


def _generic_handle(rng: random.Random, kind: str) -> str:
    forms = [
        f"@user_{rng.randint(1000000, 99999999)}",
        f"@_user_{rng.randint(100000, 9999999)}",
        f"@{kind}.{rng.choice(['lover', 'addict', 'fan', 'queen', 'daily'])}.{rng.randint(10, 99)}",
        f"@{kind}_{rng.choice(['gainz', 'inspo', 'life', 'glow'])}_{rng.randint(10, 99)}",
        f"@_{kind}_fan_{rng.randint(100, 99999)}",
    ]
    return rng.choice(forms)


def _pick_reason(rng: random.Random) -> str:
    return rng.choice([
        "No profile picture",
        "No profile picture, no posts",
        "Generic username pattern",
        "Account < 30 days old",
        "Follows 7,000+, has < 5 followers",
        "Default avatar, generic bio",
        "Posts only reposts",
        "Random number suffix, default avatar",
        "Generic keyword spam pattern",
        "Posts only stock images",
    ])


def _pick_bio(rng: random.Random, kind: str, suspicious: bool) -> str:
    if suspicious and rng.random() < 0.5:
        return "—"
    return rng.choice([
        f"{kind} enthusiast",
        f"daily {kind} inspo",
        "—",
        "biggest fan",
        f"{kind} is life",
        "lover of all things",
    ])


def _build_followers(rng: random.Random, auth_level: float, kind: str) -> list[FollowerSample]:
    n = 240
    sketchy_share = 1 - auth_level
    out: list[FollowerSample] = []
    for _ in range(n):
        is_sketchy = rng.random() < sketchy_share
        if is_sketchy:
            handle = _generic_handle(rng, kind)
            out.append(FollowerSample(
                handle=handle,
                has_avatar=rng.random() < 0.25,
                post_count=rng.randint(0, 4),
                account_age_days=rng.randint(1, 60),
                follower_count=rng.randint(0, 50),
                following_count=rng.randint(500, 9000),
                is_generic_pattern=True,
                bio=_pick_bio(rng, kind, True),
            ))
        else:
            first = rng.choice(_NAMES_FIRST).lower()
            last = rng.choice(_NAMES_LAST).lower()
            out.append(FollowerSample(
                handle=f"@{first}.{last}",
                has_avatar=True,
                post_count=rng.randint(20, 800),
                account_age_days=rng.randint(400, 4000),
                follower_count=rng.randint(120, 5000),
                following_count=rng.randint(80, 1200),
                is_generic_pattern=False,
                bio=_pick_bio(rng, kind, False),
            ))
    return out


def _build_posts(rng: random.Random, auth_level: float, base_likes: int) -> list[PostSample]:
    points = 80
    noise = 0.04 + (1 - auth_level) * 0.4
    spike_count = max(0, round((1 - auth_level) * 9 - 1))
    spike_idx: set[int] = set()
    while len(spike_idx) < spike_count:
        spike_idx.add(rng.randint(5, points - 5))
    likes = base_likes * (0.9 + rng.random() * 0.2)
    comments = max(20.0, likes * (0.012 + rng.random() * 0.006))
    out: list[PostSample] = []
    for i in range(points):
        is_spike = i in spike_idx
        spike_mul = (2.4 + rng.random() * 1.8) if is_spike else 1.0
        drift = (rng.random() - 0.5) * 2 * noise
        likes = max(800.0, likes * (1 + drift) * (spike_mul if is_spike else 1.0))
        comments = max(15.0, comments * (1 + drift * 0.8) * (spike_mul * 0.6 if is_spike else 1.0))
        out.append(PostSample(day=i, likes=int(round(likes)), comments=int(round(comments)), is_spike=is_spike))
    return out


def _build_comments(rng: random.Random, auth_level: float) -> list[CommentSample]:
    n = 1200
    spam_share = max(0.02, (1 - auth_level) * 0.55)
    generic_share = max(0.1, 0.18 + (1 - auth_level) * 0.3)
    out: list[CommentSample] = []
    spam_phrases = ["DM me 🔥🔥", "check my profile", "follow back?", "💯💯💯", "🔥🔥🔥🔥🔥"]
    generic_phrases = ["love it ❤️", "amazing 🔥", "🔥", "❤️❤️❤️", "wow", "👏👏👏", "💪", "queen"]
    real_phrases = [
        "the second slide is incredible — what camera was that?",
        "i tried this routine for two weeks and the texture really did calm down",
        "where is this taken? planning a trip there in june",
        "fwiw, the linked product is half the price at the second link",
    ]
    for _ in range(n):
        r = rng.random()
        if r < spam_share:
            out.append(CommentSample(handle=_generic_handle(rng, "x"), text=rng.choice(spam_phrases),
                                     is_generic=False, is_spam=True,
                                     seconds_after_post=rng.randint(2, 90) if rng.random() < 0.5 else rng.randint(120, 86400)))
        elif r < spam_share + generic_share:
            out.append(CommentSample(handle=_generic_handle(rng, "x"), text=rng.choice(generic_phrases),
                                     is_generic=True, is_spam=False,
                                     seconds_after_post=rng.randint(60, 86400)))
        else:
            out.append(CommentSample(handle=f"@{rng.choice(_NAMES_FIRST).lower()}_{rng.randint(10,999)}",
                                     text=rng.choice(real_phrases),
                                     is_generic=False, is_spam=False,
                                     seconds_after_post=rng.randint(300, 172800)))
    return out


def _default_audience(rng: random.Random, niche: str, auth_level: float) -> AudienceSample:
    if auth_level < 0.4:
        countries = [
            {"country": "Bangladesh", "value": 19},
            {"country": "Pakistan", "value": 17},
            {"country": "Egypt", "value": 14},
            {"country": "Nigeria", "value": 11},
            {"country": "United States", "value": 8},
        ]
        ages = [
            {"label": "18-24", "value": 42},
            {"label": "25-34", "value": 24},
            {"label": "35-44", "value": 14},
            {"label": "45-54", "value": 12},
            {"label": "55+", "value": 8},
        ]
    else:
        countries = [
            {"country": "United States", "value": 36},
            {"country": "United Kingdom", "value": 14},
            {"country": "Canada", "value": 10},
            {"country": "Australia", "value": 7},
            {"country": "Germany", "value": 5},
        ]
        ages = [
            {"label": "18-24", "value": 22},
            {"label": "25-34", "value": 38},
            {"label": "35-44", "value": 22},
            {"label": "45-54", "value": 12},
            {"label": "55+", "value": 6},
        ]
    f = 50 + rng.randint(-10, 14)
    m = 100 - f - 2
    return AudienceSample(age_groups=ages, top_countries=countries, gender_split={"female": f, "male": m, "other": 2})


def synthesize(handle: str, platform: str | None = None) -> ProviderData:
    handle_norm = handle if handle.startswith("@") else f"@{handle}"
    handle_norm = handle_norm.lower()
    fix = fixture_for(handle_norm)
    rng = random.Random(_seed(handle_norm))

    if fix:
        platform_v = fix["platform"]
        auth_level = fix["authenticity_level"]
        profile = ProfileData(
            handle=handle_norm,
            platform=platform_v,
            name=fix["name"],
            niche=fix["niche"],
            followers=fix["followers"],
            following=fix["following"],
            posts=fix["posts"],
            account_age_days=fix["account_age_days"],
            verified=fix["verified"],
            location=fix["location"],
            avatar=fix["avatar"],
            avatar_hue=fix["avatar_hue"],
        )
        audience = AudienceSample(
            age_groups=fix["audience"]["age_groups"],
            top_countries=fix["audience"]["top_countries"],
            gender_split=fix["audience"]["gender_split"],
        )
    else:
        platform_v = _platform_default(handle_norm, platform)
        auth_level = _derive_authenticity(handle_norm)
        first = rng.choice(_NAMES_FIRST)
        last = rng.choice(_NAMES_LAST)
        name = f"{first} {last}"
        niche = rng.choice(_NICHE_BANK[platform_v])
        followers = int(2000 * (1 + rng.random() * 50) * (1.5 if auth_level < 0.4 else 1))
        profile = ProfileData(
            handle=handle_norm,
            platform=platform_v,
            name=name,
            niche=niche,
            followers=followers,
            following=rng.randint(150, 2000),
            posts=rng.randint(40, 1500),
            account_age_days=rng.randint(60, 3000) if auth_level > 0.4 else rng.randint(30, 400),
            verified=auth_level > 0.8 and rng.random() < 0.3,
            location=rng.choice(_LOCATIONS),
            avatar=_fmt_avatar(name),
            avatar_hue=rng.randint(0, 359),
        )
        audience = _default_audience(rng, niche, auth_level)

    base_likes = max(2000, int(profile.followers * (0.005 + (auth_level - 0.2) * 0.05)))
    followers_sample = _build_followers(rng, auth_level, profile.niche.split()[0].lower())
    posts_sample = _build_posts(rng, auth_level, base_likes)
    comments_sample = _build_comments(rng, auth_level)

    return ProviderData(
        profile=profile,
        followers=followers_sample,
        posts=posts_sample,
        comments=comments_sample,
        audience=audience,
    )
