# 🐳 Despliegue en Railway - Portfolio William Peña

Este proyecto ha sido dockerizado para ser desplegado fácilmente en Railway.

## 📦 Archivos de Dockerización

### `Dockerfile`
- Utiliza **nginx:alpine** como imagen base (ligera y eficiente)
- Copia todos los archivos estáticos al directorio de nginx
- Expone el puerto 80
- Configuración optimizada para producción

### `nginx.conf`
- Configuración personalizada de nginx
- Soporte para Single Page Application (SPA)
- Cache optimizado para archivos estáticos
- Manejo de errores

### `.dockerignore`
- Excluye archivos innecesarios del contexto de Docker
- Optimiza el tamaño de la imagen
- Excluye archivos de desarrollo y sistema

### `railway.toml`
- Configuración específica para Railway
- Define el tipo de builder (Dockerfile)
- Configura healthcheck y políticas de reinicio

## 🚀 Pasos para Desplegar en Railway

### 1. Preparar el repositorio
```bash
git add .
git commit -m "Add Docker configuration for Railway deployment"
git push origin main
```

### 2. Desplegar en Railway

#### Opción A: Desde GitHub
1. Ve a [Railway.app](https://railway.app)
2. Conecta tu cuenta de GitHub
3. Selecciona el repositorio `portafolio-sass`
4. Railway detectará automáticamente el Dockerfile
5. ¡Listo! Tu aplicación se desplegará automáticamente

#### Opción B: Desde Railway CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Hacer login
railway login

# Inicializar proyecto
railway init

# Desplegar
railway up
```

### 3. Variables de Entorno (Opcional)
Si necesitas configurar variables de entorno:
```bash
railway variables set VARIABLE_NAME=value
```

## 🔧 Configuración Local para Desarrollo

### Usar Docker localmente:
```bash
# Construir la imagen
docker build -t portfolio-william .

# Ejecutar el contenedor
docker run -p 8080:80 portfolio-william
```

### Acceder a la aplicación:
- Local: http://localhost:8080
- Railway: https://tu-proyecto.railway.app

## 📁 Estructura del Proyecto

```
portfolio/
├── Dockerfile              # Configuración de Docker
├── nginx.conf              # Configuración de nginx
├── railway.toml            # Configuración de Railway
├── .dockerignore           # Archivos excluidos de Docker
├── package.json            # Metadatos del proyecto
├── index.html              # Página principal
├── sign_up.html           # Página de registro
├── IMAGEN.jpg             # Imagen de perfil
├── css/
│   ├── styles.css         # Estilos compilados
│   └── styles.css.map     # Source map
├── js/
│   ├── navigation.js      # JavaScript para navegación
│   └── signup.js          # JavaScript para registro
└── sass/
    ├── _form.scss         # Estilos de formularios
    ├── _navbar.scss       # Estilos de navegación
    ├── _personal.scss     # Estilos personales
    ├── _skills.scss       # Estilos de habilidades
    ├── _teaser.scss       # Estilos de teaser
    ├── _variables.scss    # Variables SASS
    └── main.scss          # Archivo principal SASS
```

## 🌟 Características del Despliegue

- ✅ **Ligero**: Imagen Alpine Linux (~5MB base)
- ✅ **Rápido**: Nginx optimizado para archivos estáticos
- ✅ **Escalable**: Configuración lista para producción
- ✅ **Cache**: Configuración de cache para mejor rendimiento
- ✅ **Health Check**: Monitoreo automático de la aplicación
- ✅ **Auto-restart**: Reinicio automático en caso de fallos

## 📞 Contacto

**William Andrés Peña Vargas**
- 📧 Email: williamandres1603@gmail.com
- 💻 GitHub: [github.com/ZyFalo](https://github.com/ZyFalo)
- 📱 Teléfono: +57 319 663 2134
- 📍 Bogotá D.C., Colombia

---
*Dockerizado con ❤️ para Railway*
