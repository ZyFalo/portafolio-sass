# 🚂 Desplegar en Railway - Instrucciones

## 📋 Preparación del proyecto

✅ **El proyecto ya está configurado para Railway** con los siguientes archivos:

- `Procfile` - Comando de inicio para Railway
- `requirements.txt` - Dependencias de Python
- `railway.json` - Configuración específica de Railway
- `runtime.txt` - Versión de Python
- `.gitignore` - Archivos a ignorar en Git

## 🚀 Pasos para desplegar en Railway

### 1. **Subir a GitHub**
```bash
# Desde tu proyecto
git add .
git commit -m "feat: Implementar reCAPTCHA con FastAPI para Railway"
git push origin signup
```

### 2. **Crear proyecto en Railway**
1. Ve a [railway.app](https://railway.app)
2. Haz clic en **"Start a New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway para acceder a tu repositorio
5. Selecciona tu repositorio `portafolio-sass`
6. Selecciona la rama `signup`

### 3. **Configuración automática**
Railway detectará automáticamente:
- ✅ Proyecto Python con FastAPI
- ✅ Archivo `requirements.txt`
- ✅ Comando de inicio desde `Procfile`
- ✅ Puerto dinámico desde variable `$PORT`

### 4. **Variables de entorno (opcional)**
Si quieres personalizar algo:
- `PORT` - Railway lo asigna automáticamente
- `RECAPTCHA_SECRET_KEY` - Ya está en el código (puedes moverlo a variables de entorno)

### 5. **Dominio personalizado**
Railway te asignará un dominio como:
- `https://tu-proyecto.up.railway.app`
- Puedes configurar un dominio personalizado en la configuración

## 🔧 Características configuradas para Railway

### ✅ **Backend FastAPI**
- ✅ Puerto dinámico con `$PORT`
- ✅ Host `0.0.0.0` para aceptar conexiones externas
- ✅ Archivos estáticos servidos por FastAPI
- ✅ CORS configurado para dominios de Railway
- ✅ Endpoint de health check en `/health`

### ✅ **Frontend automático**
- ✅ Detección automática de entorno (local vs Railway)
- ✅ URLs de API dinámicas
- ✅ reCAPTCHA funcionando en producción

### ✅ **Archivos estáticos**
- ✅ CSS, JS e imágenes servidos correctamente
- ✅ Rutas configuradas para todos los archivos

## 🌐 URLs disponibles después del despliegue

Cuando Railway termine el despliegue, tendrás:

- **🏠 Página principal**: `https://tu-dominio.railway.app/`
- **📝 Formulario**: `https://tu-dominio.railway.app/sign_up.html`
- **📚 API Docs**: `https://tu-dominio.railway.app/docs`
- **💊 Health Check**: `https://tu-dominio.railway.app/health`
- **🤖 reCAPTCHA API**: `https://tu-dominio.railway.app/validate-recaptcha`

## 🧪 Probar después del despliegue

1. **Abre** tu dominio de Railway
2. **Completa** el formulario de registro
3. **Resuelve** el reCAPTCHA
4. **Verifica** que el botón se habilita
5. **Envía** el formulario para confirmar que todo funciona

## 🔍 Verificar logs

En Railway puedes ver los logs en tiempo real:
1. Ve a tu proyecto en Railway
2. Haz clic en la pestaña **"Deployments"**
3. Selecciona el despliegue activo
4. Ve la pestaña **"Logs"** para ver la salida del servidor

## 🛠️ Solución de problemas

### ❌ **Error: Build failed**
- Verifica que `requirements.txt` tenga las versiones correctas
- Revisa los logs de build en Railway

### ❌ **Error: Application failed to respond**
- Verifica que el puerto esté configurado correctamente (`$PORT`)
- Revisa que el comando de inicio sea correcto en `Procfile`

### ❌ **Error: reCAPTCHA no funciona**
- Asegúrate de que la Site Key sea correcta
- Verifica que el dominio esté autorizado en Google reCAPTCHA Console

### ❌ **Error: CORS**
- Verifica que el dominio de Railway esté incluido en `allow_origins`
- Railway asigna dominios que cambian, usa patrones como `"*.railway.app"`

## 📊 Monitoreo

Railway proporciona:
- 📈 **Métricas**: CPU, memoria, red
- 📝 **Logs**: En tiempo real
- ⚡ **Uptime**: Disponibilidad del servicio
- 🔄 **Auto-deploy**: Despliegue automático en cada push

¡Tu proyecto estará listo para producción! 🎉
