# 🐳 Dockerfile para Portfolio con reCAPTCHA
# Imagen base optimizada para Python
FROM python:3.11-slim

# 📋 Metadatos del contenedor
LABEL maintainer="William Peña <williamandres1603@gmail.com>"
LABEL description="Portfolio personal con sistema de registro y reCAPTCHA"
LABEL version="1.0.0"

# 🔧 Variables de entorno para optimización
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# 📁 Crear directorio de trabajo
WORKDIR /app

# 📦 Instalar dependencias del sistema (si son necesarias)
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# 📋 Copiar requirements y instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 📁 Copiar código fuente y archivos estáticos
COPY . .

# 👤 Crear usuario no-root para seguridad
RUN adduser --disabled-password --gecos '' appuser && \
    chown -R appuser:appuser /app
USER appuser

# 🌐 Exponer puerto
EXPOSE $PORT

# 🚀 Comando de inicio optimizado para Railway
CMD uvicorn backend:app --host 0.0.0.0 --port $PORT
