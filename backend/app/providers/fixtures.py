"""Seeded fixtures matching the original prototype (Maya/Drew/Ivy).

Each fixture pins an authenticity_level (0..1, lower = more fake) and
profile metadata so the demo experience matches the prototype's verdicts.
"""

FIXTURES: dict[str, dict] = {
    "@mayachen.studio": {
        "platform": "instagram",
        "name": "Maya Chen",
        "niche": "Architecture & Interiors",
        "followers": 284_300,
        "following": 612,
        "posts": 1247,
        "account_age_days": int(6.2 * 365),
        "verified": True,
        "location": "Brooklyn, NY",
        "avatar": "MC",
        "avatar_hue": 24,
        "authenticity_level": 0.87,
        "audience": {
            "age_groups": [
                {"label": "18-24", "value": 14},
                {"label": "25-34", "value": 41},
                {"label": "35-44", "value": 28},
                {"label": "45-54", "value": 12},
                {"label": "55+", "value": 5},
            ],
            "top_countries": [
                {"country": "United States", "value": 38},
                {"country": "United Kingdom", "value": 14},
                {"country": "Canada", "value": 9},
                {"country": "Australia", "value": 7},
                {"country": "Germany", "value": 5},
            ],
            "gender_split": {"female": 64, "male": 34, "other": 2},
        },
    },
    "@drewfitlife": {
        "platform": "tiktok",
        "name": "Drew Parker",
        "niche": "Fitness & Wellness",
        "followers": 612_400,
        "following": 1842,
        "posts": 423,
        "account_age_days": int(1.8 * 365),
        "verified": False,
        "location": "Miami, FL",
        "avatar": "DP",
        "avatar_hue": 142,
        "authenticity_level": 0.54,
        "audience": {
            "age_groups": [
                {"label": "18-24", "value": 47},
                {"label": "25-34", "value": 28},
                {"label": "35-44", "value": 12},
                {"label": "45-54", "value": 8},
                {"label": "55+", "value": 5},
            ],
            "top_countries": [
                {"country": "Indonesia", "value": 22},
                {"country": "Brazil", "value": 18},
                {"country": "United States", "value": 14},
                {"country": "India", "value": 11},
                {"country": "Philippines", "value": 9},
            ],
            "gender_split": {"female": 38, "male": 60, "other": 2},
        },
    },
    "@ivy.glow.beauty": {
        "platform": "instagram",
        "name": "Ivy Marlowe",
        "niche": "Beauty & Skincare",
        "followers": 1_240_000,
        "following": 312,
        "posts": 89,
        "account_age_days": int(0.6 * 365),
        "verified": False,
        "location": "Los Angeles, CA",
        "avatar": "IM",
        "avatar_hue": 320,
        "authenticity_level": 0.23,
        "audience": {
            "age_groups": [
                {"label": "18-24", "value": 38},
                {"label": "25-34", "value": 22},
                {"label": "35-44", "value": 14},
                {"label": "45-54", "value": 13},
                {"label": "55+", "value": 13},
            ],
            "top_countries": [
                {"country": "Bangladesh", "value": 19},
                {"country": "Pakistan", "value": 17},
                {"country": "Egypt", "value": 14},
                {"country": "Nigeria", "value": 11},
                {"country": "United States", "value": 8},
            ],
            "gender_split": {"female": 51, "male": 47, "other": 2},
        },
    },
}


def fixture_for(handle: str) -> dict | None:
    return FIXTURES.get(handle.lower())
