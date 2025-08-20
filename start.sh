#!/bin/bash
# Script de inicio para Railway

echo "🚀 Iniciando aplicación..."
echo "📦 Instalando dependencias..."

# Instalar dependencias si no están instaladas
pip install --no-cache-dir -r requirements.txt

echo "🌐 Iniciando servidor FastAPI..."
echo "📍 Puerto: $PORT"

# Iniciar servidor
python -m uvicorn backend:app --host 0.0.0.0 --port $PORT --workers 1
