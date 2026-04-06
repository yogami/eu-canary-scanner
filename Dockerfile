FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .

# Install dependencies, including Playwright browsers if someone wants to run tests
RUN pip install --no-cache-dir -r requirements.txt
RUN playwright install chromium --with-deps

COPY . .

# Expose port for Railway
EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
