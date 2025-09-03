# 🚀 Guía de Despliegue en Railway

## Pasos para desplegar:

1. **Conectar a Railway:**
   - Ve a https://railway.app
   - Inicia sesión con GitHub
   - Crea un nuevo proyecto
   - Conecta este repositorio

2. **Variables de entorno:**
   ```
   RECAPTCHA_SECRET_KEY=6LeWRbwrAAAAAG9boVQpEj2Vgv7gE5FYGf5iqnxj
   PORT=8000
   ```

3. **Railway detectará automáticamente:**
   - El Dockerfile
   - El railway.json
   - Las dependencias de Python

4. **URL final:**
   - Railway te dará una URL como: https://tu-proyecto.railway.app
   - Actualiza esta URL en tu configuración de reCAPTCHA de Google

## Comandos útiles:

### Construir imagen Docker localmente:
```bash
docker build -t portfolio .
```

### Ejecutar contenedor localmente:
```bash
docker run -p 8000:8000 -e RECAPTCHA_SECRET_KEY="tu_clave" portfolio
```

### Con Docker Compose:
```bash
docker-compose up --build
```

## Troubleshooting:

- **Error de puerto:** Railway asigna PORT automáticamente
- **reCAPTCHA falla:** Verifica que el dominio esté en Google reCAPTCHA
- **Archivos estáticos no cargan:** Verifica que estén en la imagen Docker
