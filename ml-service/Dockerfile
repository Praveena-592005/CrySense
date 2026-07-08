FROM python:3.13-slim

WORKDIR /app

# Point to the subfolder explicitly
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code from the subfolder
COPY ml-service/ .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]