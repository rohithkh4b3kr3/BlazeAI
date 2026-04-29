# BlazeAI Python Backend

Flask API for BlazeAI tools: Image→PDF, Image Compressor, PDF→Word, Remove Background, Plagiarism Check, Currency. Uses **SQLite** (no extra package) for optional logging.

## Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set `HUGGINGFACE_API_KEY` for the Plagiarism Check feature.

## Run

```bash
python app.py
```

Server runs at `http://localhost:5000`. Frontend should use `VITE_API_URL=http://localhost:5000` (or leave unset for default).

## Endpoints

- `POST /api/pdf/upload` — multipart `images` → PDF file
- `POST /api/compress` — multipart `image` + form `quality` → JPEG
- `POST /api/pdf-to-word` — multipart `pdf` → DOCX file
- `POST /api/remove-bg` — multipart `image` → PNG (transparent BG)
- `POST /api/plagiarism/check` — JSON `{ "text": "..." }` → Hugging Face result
- `GET /api/currency/currencies` — list of currencies
- `GET /api/currency/convert?amount=1&from_currency=USD&to_currency=EUR` — convert
- `GET /api/stats` — conversion counts from SQLite
- `GET /api/health` — health check

**SQLite:** DB file is created at `backend/data/blazeai.db` (override with `DATABASE_PATH` in .env). Tables: `conversion_logs`, `currency_queries`. Used for optional logging and stats.
