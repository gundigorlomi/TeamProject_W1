import time

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def _auth(client) -> dict:
    client.post("/auth/signup", json={"email": "test@example.com", "password": "pw12345"})
    r = client.post("/auth/login", json={"email": "test@example.com", "password": "pw12345"})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


def test_signup_login_me(client):
    h = _auth(client)
    r = client.get("/auth/me", headers=h)
    assert r.status_code == 200
    assert r.json()["email"] == "test@example.com"


def test_search_seeded_influencers(client):
    h = _auth(client)
    r = client.get("/influencers", headers=h)
    assert r.status_code == 200
    handles = {x["handle"] for x in r.json()}
    assert "@mayachen.studio" in handles
    assert "@drewfitlife" in handles
    assert "@ivy.glow.beauty" in handles


def test_create_scan_and_poll(client):
    h = _auth(client)
    r = client.post("/scans", json={"handle": "@brand_test_42"}, headers=h)
    assert r.status_code == 202
    scan_id = r.json()["id"]
    body = None
    for _ in range(60):
        r = client.get(f"/scans/{scan_id}", headers=h)
        if r.status_code == 200 and r.json()["status"] == "done":
            body = r.json()
            break
        time.sleep(0.1)
    assert body is not None, "scan did not complete in time"
    assert body["status"] == "done"
    assert isinstance(body["score"], int)
    assert body["verdict"] in ("Authentic", "Suspicious", "Likely Fake")
    assert "subscores" in body
