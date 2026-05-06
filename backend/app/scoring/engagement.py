from app.providers.base import ProviderData
from app.scoring.flags import Flag


# Rough niche-typical engagement rates (likes / followers per post)
_NICHE_ER_BASELINE = {
    "instagram": 0.038,
    "tiktok": 0.062,
}


def score(data: ProviderData) -> tuple[int, list[Flag]]:
    posts = data.posts
    comments = data.comments
    profile = data.profile
    if not posts or profile.followers == 0:
        return 50, []

    avg_likes = sum(p.likes for p in posts) / len(posts)
    avg_comments = sum(p.comments for p in posts) / len(posts)
    er = avg_likes / max(profile.followers, 1)
    baseline = _NICHE_ER_BASELINE.get(profile.platform, 0.04)
    er_ratio = er / baseline  # 1.0 ~ on par

    spam = sum(1 for c in comments if c.is_spam)
    generic = sum(1 for c in comments if c.is_generic)
    pct_spam = spam / max(len(comments), 1)
    pct_generic = generic / max(len(comments), 1)

    # Burst detection: comments arriving within 90s of post (mock signal)
    bursts = sum(1 for c in comments if c.seconds_after_post < 90 and c.is_spam)
    burst_ratio = bursts / max(len(comments), 1)

    cl_ratio = avg_comments / max(avg_likes, 1)  # comments per like
    cl_baseline = 0.018

    penalty = 0.0
    if er_ratio < 0.4:
        penalty += 35
    elif er_ratio < 0.7:
        penalty += 18
    elif er_ratio < 1.0:
        penalty += 6
    penalty += pct_spam * 55
    penalty += pct_generic * 18
    penalty += burst_ratio * 40
    if cl_ratio < cl_baseline * 0.6:
        penalty += 8

    raw = max(0.0, 100.0 - penalty)
    s = int(round(raw))

    flags: list[Flag] = []
    if er_ratio < 0.4:
        flags.append(Flag(
            "high",
            f"Engagement rate {er*100:.2f}% — bottom tier vs niche baseline ({baseline*100:.1f}%)",
            "engagement",
        ))
    elif er_ratio < 0.7:
        flags.append(Flag(
            "med",
            f"Engagement rate ({er*100:.1f}%) far below niche average ({baseline*100:.1f}%)",
            "engagement",
        ))
    if pct_spam > 0.35:
        flags.append(Flag("high", f"{int(pct_spam*100)}% of comments flagged as spam or template-generated", "engagement"))
    elif pct_spam > 0.15:
        flags.append(Flag("med", f"{int(pct_spam*100)}% of recent comments are generic emoji-only or spam", "engagement"))
    if burst_ratio > 0.05:
        flags.append(Flag("low", "Comment timing: heavy burst within 90 seconds of recent posts", "engagement"))
    if cl_ratio < cl_baseline * 0.6:
        flags.append(Flag("low", "Comment-to-like ratio below niche peers", "engagement"))

    return s, flags


def comment_breakdown(data: ProviderData) -> dict[str, int]:
    if not data.comments:
        return {"authentic": 0, "generic": 0, "spam": 0}
    n = len(data.comments)
    spam = sum(1 for c in data.comments if c.is_spam)
    generic = sum(1 for c in data.comments if c.is_generic)
    authentic = n - spam - generic
    return {
        "authentic": int(round(authentic / n * 100)),
        "generic": int(round(generic / n * 100)),
        "spam": int(round(spam / n * 100)),
    }
