from app.providers.base import ProviderData
from app.scoring.flags import Flag


def score(data: ProviderData) -> tuple[int, list[Flag]]:
    followers = data.followers
    if not followers:
        return 50, []

    n = len(followers)
    no_avatar = sum(1 for f in followers if not f.has_avatar)
    no_posts = sum(1 for f in followers if f.post_count == 0)
    young = sum(1 for f in followers if f.account_age_days < 30)
    generic = sum(1 for f in followers if f.is_generic_pattern)
    skewed_ratio = sum(
        1 for f in followers
        if f.following_count > 1000 and f.follower_count < 20
    )

    pct_no_avatar = no_avatar / n
    pct_no_posts = no_posts / n
    pct_young = young / n
    pct_generic = generic / n
    pct_skewed = skewed_ratio / n

    # Per-signal penalty weights tuned so a creator with X% sketchy
    # followers lands roughly at 100-X (linearly). Stacking caps prevent
    # any single signal from sinking the score on its own.
    penalty = 0.0
    penalty += pct_no_avatar * 38
    penalty += pct_no_posts * 22
    penalty += pct_young * 28
    penalty += pct_generic * 22
    penalty += pct_skewed * 24
    raw = max(0.0, 100.0 - penalty)
    s = int(round(raw))

    flags: list[Flag] = []
    if pct_no_avatar > 0.25:
        flags.append(Flag("high", f"{int(pct_no_avatar*100)}% of followers have no profile picture", "follower_quality"))
    elif pct_no_avatar > 0.1:
        flags.append(Flag("med", f"{int(pct_no_avatar*100)}% of followers have no profile picture", "follower_quality"))
    if pct_young > 0.4:
        flags.append(Flag("high", f"{int(pct_young*100)}% of followers were created in the last 90 days", "follower_quality"))
    elif pct_young > 0.15:
        flags.append(Flag("med", f"{int(pct_young*100)}% of followers were created in the last 90 days", "follower_quality"))
    if pct_skewed > 0.3:
        flags.append(Flag("med", f"{int(pct_skewed*100)}% of followers follow 1k+ but have <20 followers", "follower_quality"))
    if 0.02 < pct_no_posts < 0.1:
        flags.append(Flag("low", f"{int(pct_no_posts*100)}% of followers have low post counts (< 5 posts)", "follower_quality"))

    return s, flags
