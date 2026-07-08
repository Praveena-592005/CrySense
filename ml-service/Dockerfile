# /ml-service/Dockerfile
FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code
COPY . .

# Expose the port your Flask app runs on
EXPOSE 5000

# Start the application using gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]