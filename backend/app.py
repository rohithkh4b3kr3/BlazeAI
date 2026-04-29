"""
BlazeAI Python Backend – PDF, Image, Currency, Plagiarism, and more.
"""
import io
import json
import logging
from pathlib import Path

import requests
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

from config import (
    PORT,
    DEBUG,
    HOST,
    MAX_CONTENT_LENGTH,
    MAX_IMAGES_PDF,
    MAX_PLAGIARISM_TEXT_LEN,
    UPLOAD_DIR,
    HUGGINGFACE_API_KEY,
    CURRENCY_API_BASE,
    APP_NAME,
    API_VERSION,
)
from db import init_db, get_connection, log_conversion, log_currency_query, ping as db_ping
from utils import safe_upload_path, api_error, api_ok, check_rate_limit, ALLOWED_IMAGE_EXT

# -----------------------------------------------------------------------------
# Logging
# -----------------------------------------------------------------------------
logging.basicConfig(
    level=logging.DEBUG if DEBUG else logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# -----------------------------------------------------------------------------
# App
# -----------------------------------------------------------------------------
app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
CORS(app)

# Ensure upload dir exists
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
init_db()


# -----------------------------------------------------------------------------
# Error handlers
# -----------------------------------------------------------------------------
@app.errorhandler(413)
def payload_too_large(_e):
    return api_error("Request too large", 413, f"Max upload size is {MAX_CONTENT_LENGTH // (1024*1024)} MB")


@app.errorhandler(404)
def not_found(_e):
    return api_error("Not found", 404)


@app.errorhandler(500)
def internal_error(e):
    logger.exception("Unhandled error")
    msg = str(e) if DEBUG else "An error occurred"
    return api_error("Internal server error", 500, msg)


# -----------------------------------------------------------------------------
# Rate limiting (applied to all /api routes)
# -----------------------------------------------------------------------------
@app.before_request
def apply_rate_limit():
    if request.path.startswith("/api/"):
        resp, code = check_rate_limit()
        if resp is not None:
            return resp, code


# ----- Image to PDF -----
@app.route("/api/pdf/upload", methods=["POST"])
def pdf_upload():
    image_paths = []
    try:
        import img2pdf

        files = request.files.getlist("images") or request.files.getlist("image")
        if not files or (len(files) == 1 and (not files[0].filename or not files[0].filename.strip())):
            return api_error("No images uploaded", 400)

        for f in files:
            if not f.filename or not f.filename.strip():
                continue
            suf = Path(f.filename).suffix.lower()
            if suf not in ALLOWED_IMAGE_EXT:
                continue
            path = safe_upload_path(f.filename)
            f.save(str(path))
            image_paths.append(path)

        if not image_paths:
            return api_error("No valid image files (allowed: png, jpg, jpeg, webp)", 400)
        if len(image_paths) > MAX_IMAGES_PDF:
            for p in image_paths:
                try:
                    p.unlink(missing_ok=True)
                except Exception:
                    pass
            return api_error(f"Too many images. Max {MAX_IMAGES_PDF}.", 400)

        pdf_bytes = img2pdf.convert([str(p) for p in image_paths])
        for p in image_paths:
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass

        log_conversion("pdf_upload", f"{len(image_paths)} images")
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype="application/pdf",
            as_attachment=True,
            download_name="converted.pdf",
        )
    except Exception as e:
        logger.exception("pdf_upload failed")
        for p in image_paths:
            try:
                p.unlink(missing_ok=True)
            except Exception:
                pass
        return api_error("Image to PDF failed", 500, str(e))


# ----- Image Compress -----
@app.route("/api/compress", methods=["POST"])
def compress_image():
    try:
        from PIL import Image

        f = request.files.get("image")
        if not f or not f.filename or not f.filename.strip():
            return api_error("No image uploaded", 400)

        quality = request.form.get("quality", 85)
        try:
            quality = max(1, min(100, int(quality)))
        except (TypeError, ValueError):
            quality = 85

        img = Image.open(f.stream).convert("RGB")
        out = io.BytesIO()
        img.save(out, "JPEG", quality=quality, optimize=True)
        out.seek(0)
        return send_file(out, mimetype="image/jpeg", download_name="compressed.jpg")
    except Exception as e:
        logger.exception("compress_image failed")
        return api_error("Compression failed", 500, str(e))


# ----- PDF to Word -----
@app.route("/api/pdf-to-word", methods=["POST"])
def pdf_to_word():
    pdf_path = docx_path = None
    try:
        from pdf2docx import Converter

        f = request.files.get("pdf")
        if not f or not f.filename or not f.filename.strip():
            return api_error("No PDF file uploaded", 400)
        if not f.filename.lower().endswith(".pdf"):
            return api_error("File must be a PDF", 400)

        pdf_path = safe_upload_path(force_ext=".pdf")
        docx_path = safe_upload_path(force_ext=".docx")
        f.save(str(pdf_path))

        cv = Converter(str(pdf_path))
        cv.convert(str(docx_path))
        cv.close()

        with open(docx_path, "rb") as fh:
            docx_bytes = fh.read()
        pdf_path.unlink(missing_ok=True)
        docx_path.unlink(missing_ok=True)

        log_conversion("pdf_to_word", "1 PDF")
        return send_file(
            io.BytesIO(docx_bytes),
            mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            as_attachment=True,
            download_name="converted.docx",
        )
    except Exception as e:
        logger.exception("pdf_to_word failed")
        for p in (pdf_path, docx_path):
            if p:
                try:
                    p.unlink(missing_ok=True)
                except Exception:
                    pass
        return api_error("PDF to Word failed", 500, str(e))


# ----- Remove Background -----
@app.route("/api/remove-bg", methods=["POST"])
def remove_bg():
    try:
        from rembg import remove as rembg_remove
        from PIL import Image

        f = request.files.get("image")
        if not f or not f.filename or not f.filename.strip():
            return api_error("No image uploaded", 400)

        inp = Image.open(f.stream)
        out_img = rembg_remove(inp)
        out = io.BytesIO()
        out_img.save(out, "PNG")
        out.seek(0)
        return send_file(out, mimetype="image/png", download_name="no-bg.png")
    except Exception as e:
        logger.exception("remove_bg failed")
        return api_error("Remove background failed", 500, str(e))


# ----- Plagiarism Check -----
@app.route("/api/plagiarism/check", methods=["POST"])
def plagiarism_check():
    try:
        data = request.get_json() or {}
        text = (data.get("text") or "").strip()
        if not text:
            return api_error("Text cannot be empty", 400)
        if len(text) > MAX_PLAGIARISM_TEXT_LEN:
            return api_error(
                f"Text too long. Max {MAX_PLAGIARISM_TEXT_LEN} characters.",
                400,
            )

        if not HUGGINGFACE_API_KEY:
            return api_error("Plagiarism check not configured (missing API key)", 503)

        url = "https://api-inference.huggingface.co/models/indhupamula/plagrism_detection"
        r = requests.post(
            url,
            json={"inputs": text},
            headers={"Authorization": f"Bearer {HUGGINGFACE_API_KEY}", "Content-Type": "application/json"},
            timeout=30,
        )
        r.raise_for_status()
        return jsonify({"result": r.json()})
    except requests.RequestException as e:
        logger.warning("Plagiarism API request failed: %s", e)
        return api_error("Plagiarism check failed", 502, str(e))
    except Exception as e:
        logger.exception("plagiarism_check failed")
        return api_error("Plagiarism check failed", 500, str(e))


# ----- Currency (Frankfurter) -----
@app.route("/api/currency/currencies", methods=["GET"])
def currency_list():
    try:
        r = requests.get(f"{CURRENCY_API_BASE}/currencies", timeout=10)
        r.raise_for_status()
        return jsonify(r.json())
    except requests.RequestException as e:
        logger.warning("Currency list failed: %s", e)
        return api_error("Could not fetch currencies", 502, str(e))


@app.route("/api/currency/convert", methods=["GET", "POST"])
def currency_convert():
    try:
        data = {}
        if request.args:
            data = {
                "amount": request.args.get("amount"),
                "from_currency": request.args.get("from_currency"),
                "to_currency": request.args.get("to_currency"),
            }
        if not data or data.get("amount") is None:
            raw = request.get_data(as_text=True)
            if raw and raw.strip():
                try:
                    data = json.loads(raw)
                except json.JSONDecodeError:
                    pass
        if (not data or data.get("amount") is None) and request.form:
            data = {
                "amount": request.form.get("amount"),
                "from_currency": request.form.get("from_currency"),
                "to_currency": request.form.get("to_currency"),
            }
        if not data or data.get("amount") is None:
            data = request.get_json(silent=True) or data or {}

        amount = data.get("amount")
        from_cur = (data.get("from_currency") or "").strip().upper()
        to_cur = (data.get("to_currency") or "").strip().upper()

        if amount is None or from_cur == "" or to_cur == "":
            return api_error(
                "amount, from_currency and to_currency required",
                400,
                {"amount": amount, "from_currency": from_cur or None, "to_currency": to_cur or None},
            )
        try:
            amount = float(amount)
        except (TypeError, ValueError):
            return api_error("amount must be a number", 400)
        if amount < 0:
            return api_error("amount must be positive", 400)

        if from_cur == to_cur:
            return jsonify({
                "amount": amount,
                "from_currency": from_cur,
                "to_currency": to_cur,
                "rate": 1.0,
                "result": amount,
            })

        r = requests.get(
            f"{CURRENCY_API_BASE}/latest",
            params={"from": from_cur, "to": to_cur, "amount": amount},
            timeout=10,
        )
        r.raise_for_status()
        d = r.json()
        rate = d.get("rates", {}).get(to_cur)
        if rate is None:
            return api_error("Unsupported currency code", 400)
        result = amount * rate
        log_currency_query(amount, from_cur, to_cur, result)
        return jsonify({
            "amount": amount,
            "from_currency": from_cur,
            "to_currency": to_cur,
            "rate": rate,
            "result": result,
        })
    except requests.RequestException as e:
        logger.warning("Currency convert failed: %s", e)
        return api_error("Conversion failed", 502, str(e))
    except Exception as e:
        logger.exception("currency_convert failed")
        return api_error("Conversion failed", 500, str(e))


# ----- Stats -----
@app.route("/api/stats", methods=["GET"])
def stats():
    try:
        with get_connection() as conn:
            cur = conn.execute(
                "SELECT tool, COUNT(*) as cnt FROM conversion_logs GROUP BY tool"
            )
            conversions = {row["tool"]: row["cnt"] for row in cur.fetchall()}
            cur = conn.execute("SELECT COUNT(*) as cnt FROM currency_queries")
            currency_count = cur.fetchone()["cnt"]
        return jsonify({
            "conversions": conversions,
            "currency_queries": currency_count,
        })
    except Exception as e:
        logger.exception("stats failed")
        return api_error("Stats failed", 500, str(e))


# ----- Health -----
@app.route("/api/health", methods=["GET"])
def health():
    db_ok = db_ping()
    return jsonify({
        "status": "ok" if db_ok else "degraded",
        "backend": "python",
        "database": "ok" if db_ok else "error",
        "version": API_VERSION,
        "app": APP_NAME,
    })


# ----- Run -----
if __name__ == "__main__":
    logger.info("%s backend starting on %s:%s (debug=%s)", APP_NAME, HOST, PORT, DEBUG)
    app.run(host=HOST, port=PORT, debug=DEBUG)
