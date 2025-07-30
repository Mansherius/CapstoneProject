# backend/Dockerfile

FROM python:3.12-slim-bullseye

WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .

RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends gcc && \
	pip install --no-cache-dir -r requirements.txt && \
	apt-get purge -y --auto-remove gcc && \
	rm -rf /var/lib/apt/lists/*

# Copy the application code
COPY . .

# Expose the Flask app's port
EXPOSE 5001

# Run the app
CMD ["python3", "app.py"]


