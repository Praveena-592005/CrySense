FROM python:3.13-slim

WORKDIR /app

# Since Root Directory is 'ml-service', we are already 'inside' it
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code from the current directory
COPY . .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]