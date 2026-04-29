"""
Shared utilities: safe filenames, rate limiting, API response helpers.
"""
import time
import uuid
import logging
from functools import wraps
from pathlib import Path

from flask import request, jsonify

from config import UPLOAD_DIR, RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_SEC

logger = logging.getLogger(__name__)

# In-memory rate limit: ip -> list of timestamps
_rate_store = {}
_CLEANUP_AFTER = 300  # drop entries older than 5 min


def _cleanup_rate_store():
    now = time.monotonic()
    to_del = [k for k, v in _rate_store.items() if v and (now - v[-1]) > _CLEANUP_AFTER]
    for k in to_del:
        del _rate_store[k]


def check_rate_limit():
    """
    Enforce per-IP rate limit. Returns (None, None) if allowed, else (response, status_code).
    """
    _cleanup_rate_store()
    ip = request.remote_addr or "unknown"
    now = time.monotonic()
    if ip not in _rate_store:
        _rate_store[ip] = []
    times = _rate_store[ip]
    cutoff = now - RATE_LIMIT_WINDOW_SEC
    times[:] = [t for t in times if t > cutoff]
    if len(times) >= RATE_LIMIT_REQUESTS:
        return jsonify({"error": "Too many requests. Try again later."}), 429
    times.append(now)
    return None, None


def rate_limit(f):
    """Decorator: limit requests per IP per window (config: RATE_LIMIT_*)."""
    @wraps(f)
    def wrapped(*args, **kwargs):
        resp, code = check_rate_limit()
        if resp is not None:
            return resp, code
        return f(*args, **kwargs)
    return wrapped


# Allowed image extensions for PDF and general uploads
ALLOWED_IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp")
ALLOWED_IMAGE_EXT_SET = frozenset(ALLOWED_IMAGE_EXT)


def safe_upload_path(original_filename: str = "", subdir: str = "", force_ext: str = None) -> Path:
    """
    Return a safe path under UPLOAD_DIR. Uses UUID + sanitized extension only.
    Avoids path traversal and keeps filenames predictable.
    force_ext: e.g. ".pdf" or ".docx" to force extension.
    """
    if force_ext:
        ext = force_ext if force_ext.startswith(".") else f".{force_ext}"
    else:
        ext = (Path(original_filename or "").suffix or "").lower()
        if ext and ext not in ALLOWED_IMAGE_EXT_SET and ext not in (".pdf", ".docx"):
            ext = ".bin"
    name = f"{uuid.uuid4().hex}{ext}"
    folder = Path(UPLOAD_DIR) / subdir if subdir else Path(UPLOAD_DIR)
    folder.mkdir(parents=True, exist_ok=True)
    return folder / name


def api_error(message: str, status: int = 400, details=None):
    """Consistent JSON error response."""
    body = {"error": message}
    if details is not None:
        body["details"] = str(details) if not isinstance(details, dict) else details
    return jsonify(body), status


def api_ok(data=None):
    """Consistent JSON success response."""
    if data is None:
        return jsonify({"status": "ok"})
    return jsonify(data)
