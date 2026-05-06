from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class ProfileData:
    handle: str
    platform: str
    name: str
    niche: str
    followers: int
    following: int
    posts: int
    account_age_days: int
    verified: bool
    location: str
    avatar: str
    avatar_hue: int


@dataclass
class FollowerSample:
    handle: str
    has_avatar: bool
    post_count: int
    account_age_days: int
    follower_count: int
    following_count: int
    is_generic_pattern: bool
    bio: str = ""


@dataclass
class PostSample:
    day: int
    likes: int
    comments: int
    is_spike: bool = False


@dataclass
class CommentSample:
    handle: str
    text: str
    is_generic: bool
    is_spam: bool
    seconds_after_post: int = 0


@dataclass
class AudienceSample:
    age_groups: list[dict] = field(default_factory=list)
    top_countries: list[dict] = field(default_factory=list)
    gender_split: dict = field(default_factory=dict)


@dataclass
class ProviderData:
    profile: ProfileData
    followers: list[FollowerSample]
    posts: list[PostSample]
    comments: list[CommentSample]
    audience: AudienceSample


class Provider(Protocol):
    platform: str

    def fetch(self, handle: str) -> ProviderData: ...
