from app.providers.base import ProviderData
from app.scoring.flags import Flag


def score(data: ProviderData) -> tuple[int, list[Flag]]:
    profile = data.profile
    posts = data.posts
    age = max(profile.account_age_days, 1)
    velocity = profile.followers / age  # followers per day

    spike_count = sum(1 for p in posts if p.is_spike)

    penalty = 0.0
    flags: list[Flag] = []

    if velocity > 4000:
        penalty += 55
        flags.append(Flag(
            "high",
            f"{profile.followers:,} followers on a {age // 30}-month-old account — 99th percentile growth velocity",
            "growth",
        ))
    elif velocity > 1000:
        penalty += 30
        flags.append(Flag(
            "med",
            f"Growth velocity {int(velocity)} followers/day — well above niche peers",
            "growth",
        ))
    elif velocity > 300:
        penalty += 12

    if spike_count >= 5:
        penalty += 30
        flags.append(Flag("high", f"{spike_count} follower spikes in 90 days — automated growth pattern likely", "growth"))
    elif spike_count >= 2:
        penalty += 14
        flags.append(Flag("med", f"{spike_count} suspicious follower spikes in 90 days", "growth"))
    elif spike_count == 1:
        penalty += 5
        flags.append(Flag("low", "Single engagement dip detected — coincides with posting break", "growth"))

    raw = max(0.0, 100.0 - penalty)
    return int(round(raw)), flags
