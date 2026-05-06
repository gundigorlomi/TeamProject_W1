"""Tests use an isolated SQLite file in a temp dir.

Env vars must be set BEFORE `app.config` is imported, hence conftest.
"""

import os
import tempfile

_TMPDIR = tempfile.mkdtemp(prefix="veracity-tests-")
os.environ.setdefault("DATABASE_URL", f"sqlite:///{_TMPDIR}/test.db")
os.environ.setdefault("JWT_SECRET", "test-secret-not-for-prod-but-long-enough-32-bytes")
