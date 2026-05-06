from app.providers.base import ProviderData
from app.providers.synth import synthesize


class MockTikTokProvider:
    platform = "tiktok"

    def fetch(self, handle: str) -> ProviderData:
        return synthesize(handle, "tiktok")
