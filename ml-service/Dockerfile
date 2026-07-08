FROM python:3.13-slim

WORKDIR /app

# Since the build context is the root '.', we must specify 'ml-service/'
COPY ml-service/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything from ml-service/ to the container /app
COPY ml-service/ .

EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]