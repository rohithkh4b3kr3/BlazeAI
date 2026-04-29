"""
SQLite database for BlazeAI. No extra dependency - SQLite is in the Python stdlib.
"""
import sqlite3
from contextlib import contextmanager

from config import DATABASE_PATH

DB_PATH = DATABASE_PATH


def init_db():
    """Create data dir and tables if they don't exist."""
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS conversion_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tool TEXT NOT NULL,
                details TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS currency_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL,
                from_currency TEXT NOT NULL,
                to_currency TEXT NOT NULL,
                result REAL NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            )
        """)
        conn.commit()


@contextmanager
def get_connection():
    """Yield a SQLite connection (auto-commits on exit, closes connection)."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def ping():
    """Return True if DB is reachable (for health check)."""
    try:
        with get_connection() as conn:
            conn.execute("SELECT 1")
        return True
    except Exception:
        return False


def log_conversion(tool: str, details: str = ""):
    """Log a conversion (e.g. 'pdf_upload', 'image_compress')."""
    try:
        with get_connection() as conn:
            conn.execute(
                "INSERT INTO conversion_logs (tool, details) VALUES (?, ?)",
                (tool, (details or "")[:500]),
            )
    except Exception:
        pass


def log_currency_query(amount: float, from_cur: str, to_cur: str, result: float):
    """Log a currency conversion."""
    try:
        with get_connection() as conn:
            conn.execute(
                """INSERT INTO currency_queries (amount, from_currency, to_currency, result)
                   VALUES (?, ?, ?, ?)""",
                (amount, from_cur, to_cur, result),
            )
    except Exception:
        pass
