FROM python:3.11-slim

# Install system dependencies including ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

# Change your existing CMD to this:
# Use --threads to reduce memory overhead compared to multiple workers
CMD gunicorn -b 0.0.0.0:$PORT --workers 1 --threads 2 --timeout 120 app:app