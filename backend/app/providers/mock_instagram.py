from app.providers.base import ProviderData
from app.providers.synth import synthesize


class MockInstagramProvider:
    platform = "instagram"

    def fetch(self, handle: str) -> ProviderData:
        return synthesize(handle, "instagram")
