"""
BlazeAI backend configuration. Loads from environment with sensible defaults.
"""
import os
import tempfile
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

# Server
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("FLASK_DEBUG", "true").lower() in ("1", "true", "yes")
HOST = os.getenv("HOST", "0.0.0.0")

# Request limits (security & stability)
MAX_CONTENT_LENGTH_MB = int(os.getenv("MAX_UPLOAD_MB", "50"))
MAX_CONTENT_LENGTH = MAX_CONTENT_LENGTH_MB * 1024 * 1024
MAX_IMAGES_PDF = min(50, max(1, int(os.getenv("MAX_IMAGES_PDF", "20"))))
MAX_PLAGIARISM_TEXT_LEN = min(100_000, max(10, int(os.getenv("MAX_PLAGIARISM_CHARS", "50000"))))

# Paths (default: system temp; set UPLOAD_DIR in .env to override)
def _upload_dir():
    base = os.getenv("UPLOAD_DIR", "")
    root = Path(base) if base else Path(tempfile.gettempdir())
    return (root / "blazeai_uploads").resolve()


def _db_path():
    p = os.getenv("DATABASE_PATH", "")
    if p:
        return Path(p).resolve()
    return (Path(__file__).resolve().parent / "data" / "blazeai.db").resolve()


UPLOAD_DIR = _upload_dir()
DATABASE_PATH = _db_path()

# External APIs
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "").strip()
CURRENCY_API_BASE = os.getenv("CURRENCY_API_BASE", "https://api.frankfurter.app").rstrip("/")

# Rate limiting (in-memory, per IP) – requests per window
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "60"))
RATE_LIMIT_WINDOW_SEC = int(os.getenv("RATE_LIMIT_WINDOW_SEC", "60"))

# App
APP_NAME = "BlazeAI"
API_VERSION = "1"
