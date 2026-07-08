FROM python:3.13-slim

WORKDIR /app

# Remove 'ml-service/' prefix; since build context is 'ml-service/',
# it will look for these files inside that folder automatically.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]