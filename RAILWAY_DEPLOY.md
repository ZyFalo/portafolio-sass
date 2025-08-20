# 🚀 Guía de Despliegue en Railway

## 📋 Pasos para desplegar en Railway

### 1. 🔧 Preparación del proyecto
El proyecto ya está dockerizado y listo para Railway con:
- ✅ `Dockerfile` optimizado
- ✅ `.dockerignore` configurado  
- ✅ `railway.toml` para configuración
- ✅ `requirements.txt` actualizado

### 2. 🌐 Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub/Google/Email
3. Verifica tu cuenta

### 3. 📁 Conectar repositorio
**Opción A: Desde GitHub**
1. Sube tu código a GitHub
2. En Railway: "Deploy from GitHub repo"
3. Selecciona tu repositorio

**Opción B: Railway CLI**
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

### 4. ⚙️ Configurar variables de entorno
En el dashboard de Railway, ve a Variables y agrega:

```
RECAPTCHA_SECRET_KEY=tu_clave_secreta_recaptcha
```

### 5. 🚀 Despliegue automático
- Railway detectará el `Dockerfile`
- Construirá la imagen automáticamente
- Desplegará en una URL única
- Asignará puerto automáticamente

### 6. 🔗 Dominio personalizado (opcional)
1. En Railway dashboard > Settings
2. Agregar dominio personalizado
3. Configurar DNS según instrucciones

## 📝 Características incluidas

### 🐳 Docker optimizado
- Python 3.11 slim (imagen ligera)
- Cache de dependencias optimizado
- Usuario no-root para seguridad
- Puerto dinámico para Railway

### 🔒 Seguridad
- Variables de entorno para secretos
- CORS configurado para Railway
- Timeouts configurados
- Manejo de errores robusto

### ⚡ Rendimiento
- FastAPI con uvicorn
- Archivos estáticos servidos directamente
- Compresión automática
- Health checks incluidos

## 🛠️ Comandos útiles

### Desarrollo local con Docker
```bash
# Construir imagen
docker build -t portfolio-william .

# Ejecutar contenedor
docker run -p 8000:8000 portfolio-william
```

### Railway CLI
```bash
# Ver logs
railway logs

# Conectar a servicio
railway connect

# Ver variables
railway variables

# Redeploy
railway up --detach
```

## 🔧 Solución de problemas

### Puerto incorrecto
- Railway asigna PORT automáticamente
- No cambiar configuración de puerto

### Variables de entorno
- Configurar RECAPTCHA_SECRET_KEY en Railway
- No incluir claves en el código

### Archivos estáticos
- Verificar rutas en HTML (`/css/`, `/js/`)
- Archivos servidos desde FastAPI

### CORS errors
- Dominios de Railway ya incluidos
- Agregar dominios personalizados si es necesario

## 📞 Soporte
- Documentación Railway: [docs.railway.app](https://docs.railway.app)
- GitHub Issues del proyecto
- Email: williamandres1603@gmail.com

---
✨ **¡Tu portfolio estará en línea en minutos!** ✨
