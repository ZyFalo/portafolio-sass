"""
🚀 Backend FastAPI para validación de reCAPTCHA
Autor: Sistema de validación
Fecha: Agosto 2025
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import httpx
import os
from typing import Dict

# 🏗️ Inicializar FastAPI
app = FastAPI(
    title="API de Validación reCAPTCHA",
    description="Servicio para validar tokens de Google reCAPTCHA",
    version="1.0.0"
)

# 🌐 Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8080", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
        "https://*.railway.app",
        "https://*.up.railway.app"
    ],  # Dominios permitidos para desarrollo y Railway
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# � Servir archivos estáticos (CSS, JS, imágenes)
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/sass", StaticFiles(directory="sass"), name="sass")

# �🔑 Configuración de reCAPTCHA
RECAPTCHA_SECRET_KEY = "6LcyBKwrAAAAAN5VbS1ONFxLexh1-PzTm24RNmKj"
RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"

# 📋 Modelo de datos para la petición
class RecaptchaRequest(BaseModel):
    """Modelo para recibir el token de reCAPTCHA"""
    recaptcha_token: str

# 📋 Modelo de respuesta
class RecaptchaResponse(BaseModel):
    """Modelo para la respuesta de validación"""
    success: bool
    message: str
    error_codes: list = []

@app.get("/")
async def root():
    """🏠 Página principal - Redirige al formulario de registro"""
    return FileResponse('sign_up.html')

@app.get("/sign_up.html")
async def signup_page():
    """📝 Página de registro"""
    return FileResponse('sign_up.html')

@app.get("/index.html")
async def index_page():
    """🏠 Página de inicio"""
    return FileResponse('index.html')

@app.get("/api")
async def api_info():
    """📚 Información de la API"""
    return {
        "message": "API de Validación reCAPTCHA",
        "status": "activo",
        "endpoints": {
            "validate_recaptcha": "/validate-recaptcha [POST]",
            "health": "/health [GET]"
        }
    }

@app.get("/health")
async def health_check():
    """💊 Endpoint de salud del servicio"""
    return {"status": "healthy", "service": "recaptcha-validator"}

@app.post("/validate-recaptcha", response_model=RecaptchaResponse)
async def validate_recaptcha(request: RecaptchaRequest) -> RecaptchaResponse:
    """
    🔐 Valida el token de reCAPTCHA con Google
    
    Args:
        request: Objeto que contiene el token de reCAPTCHA
    
    Returns:
        RecaptchaResponse: Resultado de la validación
    
    Raises:
        HTTPException: Si hay errores en la validación
    """
    
    try:
        # 📝 Preparar datos para enviar a Google
        verification_data = {
            "secret": RECAPTCHA_SECRET_KEY,
            "response": request.recaptcha_token
        }
        
        # 🌐 Realizar petición a Google reCAPTCHA API
        async with httpx.AsyncClient() as client:
            google_response = await client.post(
                RECAPTCHA_VERIFY_URL,
                data=verification_data,
                timeout=10.0  # Timeout de 10 segundos
            )
            
            # ✅ Verificar que la petición fue exitosa
            google_response.raise_for_status()
            
            # 📊 Obtener respuesta JSON de Google
            google_result = google_response.json()
            
            # 🔍 Analizar respuesta de Google
            if google_result.get("success", False):
                # ✅ reCAPTCHA válido
                return RecaptchaResponse(
                    success=True,
                    message="reCAPTCHA verificado correctamente",
                    error_codes=[]
                )
            else:
                # ❌ reCAPTCHA inválido
                error_codes = google_result.get("error-codes", [])
                
                # 🔍 Interpretar códigos de error comunes
                error_messages = {
                    "missing-input-secret": "Clave secreta faltante",
                    "invalid-input-secret": "Clave secreta inválida",
                    "missing-input-response": "Token de respuesta faltante",
                    "invalid-input-response": "Token de respuesta inválido o expirado",
                    "bad-request": "Petición malformada",
                    "timeout-or-duplicate": "Token expirado o duplicado"
                }
                
                # 📝 Generar mensaje de error descriptivo
                if error_codes:
                    error_message = "; ".join([
                        error_messages.get(code, f"Error desconocido: {code}")
                        for code in error_codes
                    ])
                else:
                    error_message = "Verificación de reCAPTCHA falló"
                
                return RecaptchaResponse(
                    success=False,
                    message=f"reCAPTCHA inválido: {error_message}",
                    error_codes=error_codes
                )
                
    except httpx.TimeoutException:
        # ⏰ Error de timeout
        raise HTTPException(
            status_code=408,
            detail="Timeout al conectar con el servicio de Google reCAPTCHA"
        )
        
    except httpx.HTTPStatusError as e:
        # 🌐 Error HTTP de Google
        raise HTTPException(
            status_code=502,
            detail=f"Error del servicio de Google reCAPTCHA: {e.response.status_code}"
        )
        
    except Exception as e:
        # 💥 Error inesperado
        raise HTTPException(
            status_code=500,
            detail=f"Error interno del servidor: {str(e)}"
        )

# 🎯 Endpoint adicional para testing
@app.post("/test-recaptcha")
async def test_recaptcha():
    """🧪 Endpoint de prueba para verificar que el servicio funciona"""
    return {
        "message": "Servicio reCAPTCHA funcionando correctamente",
        "test_token": "Use un token real de reCAPTCHA para probar",
        "endpoint": "/validate-recaptcha"
    }

if __name__ == "__main__":
    import uvicorn
    
    # 🌐 Obtener puerto de Railway o usar 8000 por defecto
    port = int(os.environ.get("PORT", 8000))
    
    print("🚀 Iniciando servidor FastAPI...")
    print(f"📍 Puerto: {port}")
    print("📚 Documentación disponible en: /docs")
    print("🔄 Modo de producción")
    
    # 🏃‍♂️ Ejecutar servidor
    uvicorn.run(
        "backend:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Sin recarga en producción
        log_level="info"
    )
