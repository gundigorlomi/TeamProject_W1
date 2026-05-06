# Veracity

An influencer authenticity checker. Paste a handle, get a 0–100 score with the
evidence behind it: follower quality, engagement patterns, audience fit, and
growth velocity. Built for marketing teams and agencies who want to stop
paying for reach that isn't real.

## What it does

You drop in `@somecreator`. The backend pulls a profile, a follower sample,
recent posts, comments, and audience demographics, then runs four scoring
passes and returns:

- a single composite score (0–100) and verdict (`Authentic` / `Suspicious` / `Likely Fake`)
- four subscores explaining where the points came from
- a 90-day engagement timeline (the UI lets you view 6m / 1y aggregates too)
- a comment-quality breakdown (authentic / generic / spam)
- audience demographics (age, top countries, gender split)
- a ranked list of red flags with severity tags
- a sample of suspicious followers and the reason each one was flagged

Two seeded handles ship with the demo (`@mayachen.studio`, `@drewfitlife`,
`@ivy.glow.beauty`); any other handle works too. Patterns like `_xx`, `bot`,
or `user_<digits>` push the score down — the synthesis is deterministic
on `hash(handle)` so the same handle always produces the same scan.

## Layout

```
backend/                FastAPI service + scoring engine
  app/
    api/                routers — auth, influencers, scans
    models/             SQLAlchemy ORM tables
    providers/          mock + (future) real platform adapters
    scoring/            four pure scoring functions + composer
    services/           background scan runner, auth helpers
    schemas/            Pydantic request/response shapes
    config.py · db.py · main.py · seed.py
  tests/
frontend/               Vite + React + TypeScript app
  src/
    pages/              Login · Dashboard · Compare
    sections/           dashboard panels (score, timeline, demographics, …)
    components/         charts, primitives, icons
    api/ · hooks/ · lib/
project wr, design/     original static prototype kept for reference
```

## Architecture

Three layers, each one swappable on its own.

### Frontend (Vite + React + TypeScript + Tailwind)

A single-page app that talks to the backend over JSON. State lives in two
hooks: `useAuth` holds the JWT in `localStorage`, `useScan` loads the latest
scan for an influencer and polls a new one if none exists yet. Everything
under the dashboard is a section component that takes a slice of the scan
result and renders it — `ScoreCard`, `EngagementTimeline`, `AudienceDemographics`,
`RedFlagsPanel`, `SuspiciousFollowers`, `CommentQuality`.

Charts are hand-rolled SVG (no chart library) so the entrance animations,
hover crosshair, and gauge can share a consistent design language. The
Vite dev server proxies `/api/*` through to FastAPI on `:8000`, so the
production and dev wiring is identical.

### Backend (FastAPI + SQLAlchemy)

The API is a thin shell around a scoring engine. Three routers (`auth`,
`influencers`, `scans`) handle HTTP; everything below them is plain Python.

A `POST /scans` returns `202` immediately with a `scan_id`. The actual work
runs in a FastAPI `BackgroundTasks` worker — `services/scan_runner.py`
opens a fresh DB session, fetches data through the configured provider,
runs the scoring engine, and writes the result back. The status field
walks `queued → running → done` (or `failed`), and the frontend polls
`GET /scans/{id}` until it lands. Lift `_execute_in_new_session` into
Celery or RQ later and nothing else has to move.

Auth is JWT — bcrypt-hashed passwords, signed tokens with a short TTL,
no server-side sessions. Every protected route depends on
`get_current_user` from `api/deps.py`.

### Scoring engine

Four pure functions, one composer:

| Function | Weight | Looks at |
|---|---|---|
| `follower_quality.score()` | 0.30 | follower sample — avatars, post counts, age, generic patterns |
| `engagement.score()` | 0.30 | post-by-post likes/comments shape, comment authenticity |
| `audience_fit.score()` | 0.20 | demographics vs. the niche the creator claims |
| `growth.score()` | 0.20 | account age vs. follower count, velocity spikes |

Each one returns `(score: int, flags: list[Flag])`. The composer in
`scoring/engine.py` weighs the four into a 0–100 number, picks a verdict,
sorts the flags by severity, packs the timeline and demographics, and
hands a `ScanOutput` back to the runner.

Adding a new heuristic is a one-file change — write a function that takes
`ProviderData`, returns a tuple, and add it to the composer. The UI picks
it up via the `subscores` dict.

### Providers

Everything platform-specific is behind a `Provider` Protocol in
`providers/base.py`. A provider takes a handle and returns a `ProviderData`
bundle (profile, followers, posts, comments, audience).

`providers/factory.py` returns a mock provider today. The mock is the
interesting part — `providers/synth.py` synthesises a deterministic
audience from `hash(handle)` plus a small set of seeded fixtures
(`providers/fixtures.py`) so the demo always looks right. Drop in a
`RealInstagramProvider` that hits the Graph API and the rest of the
stack does not change.

### Database

SQLAlchemy 2.0 with four tables: `users`, `influencers`, `scans`, `flags`.
Scans store the full result as a row — score, subscores, comment
breakdown, audience demo, timeline, suspicious followers — so the
frontend can pull the latest scan for a creator with one query.

The default `DATABASE_URL` is SQLite (`backend/veracity.db`) for dev. Point
it at Postgres and the same models run unchanged. On first boot
`seed_if_empty()` populates the three demo handles with a completed scan
each.

## Run it

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -e ".[dev]"
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Sign up with any email and a 6-character
password. Search for `maya`, `drew`, or `ivy` for the seeded creators, or
type any handle (e.g. `@brand_test_42`) and hit "Run scan".

### Tests

```powershell
cd backend
pytest
```

## API

All routes other than `/auth/signup` and `/auth/login` require
`Authorization: Bearer <jwt>`.

| Method | Path | Notes |
|---|---|---|
| `POST` | `/auth/signup` | `{email, password, agency_name}` → JWT |
| `POST` | `/auth/login` | → JWT |
| `GET`  | `/auth/me` | current user |
| `GET`  | `/influencers?q=&platform=` | search |
| `GET`  | `/influencers/{id}` | profile |
| `POST` | `/scans` | `{influencer_id}` or `{handle, platform?}` — returns `202` with `scan_id` |
| `GET`  | `/scans/{id}` | poll status; full payload when `status === "done"` |
| `GET`  | `/scans/by-influencer/{id}/latest` | most recent completed scan |
| `GET`  | `/scans/compare?a=&b=` | side-by-side payload for two influencers |
| `GET`  | `/health` | liveness probe |

## Stack

- Python 3.11 · FastAPI · SQLAlchemy 2 · Pydantic v2 · pytest
- Node 20 · Vite · React 18 · TypeScript · Tailwind CSS 3 · React Router
- SQLite for dev · Postgres for production (no model changes)
- JWT auth with bcrypt password hashing
