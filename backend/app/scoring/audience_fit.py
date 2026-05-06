from app.providers.base import ProviderData
from app.scoring.flags import Flag


# Countries we consider "primary English/Western markets" — many niches
# (US-based architecture, LA-based beauty, Miami fitness) skew here.
_PRIMARY = {"United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Ireland"}
# Markets where bot-farm follower concentration is statistically high.
_FARM_RISK = {"Bangladesh", "Pakistan", "Egypt", "Nigeria", "Indonesia", "Philippines", "India", "Brazil"}


def score(data: ProviderData) -> tuple[int, list[Flag]]:
    audience = data.audience
    flags: list[Flag] = []
    countries = audience.top_countries or []
    ages = audience.age_groups or []

    farm_share = sum(c["value"] for c in countries if c["country"] in _FARM_RISK)
    primary_share = sum(c["value"] for c in countries if c["country"] in _PRIMARY)
    top = countries[0]["value"] if countries else 0

    age_18_24 = next((a["value"] for a in ages if a["label"] == "18-24"), 0)
    age_skew_old = next((a["value"] for a in ages if a["label"] in ("45-54", "55+")), 0)

    penalty = 0.0
    if farm_share > 50:
        penalty += 45
    elif farm_share > 30:
        penalty += 25
    elif farm_share > 15:
        penalty += 10
    if primary_share < 20:
        penalty += 20
    if top < 20:
        penalty += 10
    if age_18_24 > 45:
        penalty += 10

    raw = max(0.0, 100.0 - penalty)
    s = int(round(raw))

    if farm_share > 30:
        flags.append(Flag(
            "med",
            f"Audience location mismatch — {farm_share}% from high-risk follower-farm markets",
            "audience_fit",
        ))
    elif farm_share > 15:
        flags.append(Flag("low", f"{farm_share}% of audience from elevated-risk markets", "audience_fit"))
    if primary_share < 20 and data.profile.location:
        flags.append(Flag(
            "med",
            "Audience does not match content language or creator location",
            "audience_fit",
        ))

    return s, flags
