FROM python:3.13-slim

WORKDIR /app

# Explicitly reference the folder since we are at the repository root
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from the ml-service folder
COPY ml-service/ .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]