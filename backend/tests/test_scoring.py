from app.providers.synth import synthesize
from app.scoring.engine import run as run_scoring


def test_authentic_fixture_lands_high() -> None:
    data = synthesize("@mayachen.studio")
    out = run_scoring(data)
    assert out.verdict == "Authentic"
    assert out.score >= 75
    assert out.subscores["follower_quality"] >= 70


def test_suspicious_fixture_lands_mid() -> None:
    data = synthesize("@drewfitlife")
    out = run_scoring(data)
    assert out.verdict in ("Suspicious", "Likely Fake")
    assert 25 <= out.score < 75
    # at least one engagement or growth flag
    assert any(f.category in ("engagement", "growth", "audience_fit") for f in out.flags)


def test_fake_fixture_lands_low() -> None:
    data = synthesize("@ivy.glow.beauty")
    out = run_scoring(data)
    assert out.verdict == "Likely Fake"
    assert out.score < 45
    # multiple high-severity flags
    assert sum(1 for f in out.flags if f.severity == "high") >= 2


def test_deterministic() -> None:
    a = synthesize("@brand_test_42")
    b = synthesize("@brand_test_42")
    assert a.profile.followers == b.profile.followers
    assert run_scoring(a).score == run_scoring(b).score


def test_obvious_bot_handle_scores_low() -> None:
    data = synthesize("@user_999999_bot_xx")
    out = run_scoring(data)
    assert out.score < 60
