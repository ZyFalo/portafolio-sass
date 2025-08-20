# 🚂 Despliegue Simplificado en Railway

## 🚀 Pasos rápidos

### 1. Subir a GitHub
```bash
git add .
git commit -m "feat: listo para Railway"
git push origin main
```

### 2. Desplegar en Railway
1. Ve a [railway.app](https://railway.app)
2. "Deploy from GitHub repo"
3. Selecciona `portafolio-sass`

### 3. Configurar variable
En Railway > Variables:
```
RECAPTCHA_SECRET_KEY=tu_clave_secreta
```

### 4. ¡Listo!
- Build automático con Dockerfile
- Health check: `/health`
- Aplicación: dominio generado por Railway

## ✅ Optimizaciones incluidas
- Dockerfile minimalista para Railway
- CORS abierto para todos los dominios
- Puerto dinámico (variable PORT)
- Health check endpoint
- Variables de entorno configurables
