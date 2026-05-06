from app.providers.base import Provider
from app.providers.fixtures import fixture_for
from app.providers.mock_instagram import MockInstagramProvider
from app.providers.mock_tiktok import MockTikTokProvider


def resolve(platform: str | None, handle: str | None = None) -> Provider:
    """Pick a provider for the given platform.

    Falls back to the platform pinned by a known fixture if `platform` is None,
    otherwise defaults to Instagram.
    """
    if not platform and handle:
        norm = handle if handle.startswith("@") else f"@{handle}"
        fix = fixture_for(norm.lower())
        if fix:
            platform = fix["platform"]
    platform = (platform or "instagram").lower()
    if platform == "tiktok":
        return MockTikTokProvider()
    return MockInstagramProvider()
