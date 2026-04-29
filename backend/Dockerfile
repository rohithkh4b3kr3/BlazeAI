# BlazeAI backend - Python/Flask
FROM python:3.12-slim

WORKDIR /app

# Install system deps for Pillow/rembg (optional; reduces build issues on some hosts)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# App deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# App code
COPY config.py db.py utils.py app.py ./

# Persistent data (uploads + SQLite). Create so non-root can write if we add user later.
ENV UPLOAD_DIR=/app/data/uploads \
    DATABASE_PATH=/app/data/blazeai.db \
    PORT=5000 \
    HOST=0.0.0.0 \
    FLASK_DEBUG=0
RUN mkdir -p /app/data/uploads

EXPOSE 5000

CMD ["python", "app.py"]
