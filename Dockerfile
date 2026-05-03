FROM python:3.11-slim

WORKDIR /app

# 🔥 Устанавливаем Firebird client
RUN apt-get update && apt-get install -y \
    firebird3.0-utils \
    libfbclient2 \
    && rm -rf /var/lib/apt/lists/*

# 🔥 Сообщаем fdb где библиотека
ENV LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000"]