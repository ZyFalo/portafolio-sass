# 🐳 Dockerfile optimizado para Railway
FROM python:3.11-slim

#  Configurar directorio de trabajo
WORKDIR /app

# 📦 Instalar dependencias del sistema mínimas necesarias
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# 📋 Copiar y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 📁 Copiar código fuente
COPY . .

# � Variables de entorno para Railway
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# 🚀 Railway usa la variable PORT dinámicamente
CMD ["python", "backend.py"]
