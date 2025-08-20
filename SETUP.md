# 🚀 Instrucciones para ejecutar el proyecto con reCAPTCHA

## 📋 Requisitos previos

1. **Python 3.7+** instalado en el sistema
2. **FastAPI** y sus dependencias

## 🔧 Instalación de dependencias

Ejecuta los siguientes comandos en la terminal desde la raíz del proyecto:

```bash
# Instalar FastAPI y dependencias
pip install fastapi uvicorn httpx

# O si prefieres usar requirements.txt
pip install -r requirements.txt
```

## 🎯 Ejecutar el backend (FastAPI)

```bash
# Desde la raíz del proyecto
python backend.py

# O alternativamente
uvicorn backend:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en:
- **API**: http://localhost:8000
- **Documentación**: http://localhost:8000/docs
- **Redoc**: http://localhost:8000/redoc

## 🌐 Ejecutar el frontend

Puedes usar cualquier servidor web simple. Aquí tienes algunas opciones:

### Opción 1: Python simple server
```bash
# Python 3
python -m http.server 3000

# Python 2
python -m SimpleHTTPServer 3000
```

### Opción 2: Node.js (si tienes instalado)
```bash
npx serve . -p 3000
```

### Opción 3: Live Server (VS Code)
Si usas VS Code, instala la extensión "Live Server" y haz clic derecho en `sign_up.html` → "Open with Live Server"

## 🔑 Configuración de reCAPTCHA

Las claves de reCAPTCHA ya están configuradas en el código:

- **Site Key (Frontend)**: `6LcyBKwrAAAAAGXRRbcUHehkkr5lYetSB4F8V8s7`
- **Secret Key (Backend)**: `6LcyBKwrAAAAAN5VbS1ONFxLexh1-PzTm24RNmKj`

## 🧪 Probar la funcionalidad

1. **Abre** http://localhost:3000/sign_up.html (o el puerto que uses)
2. **Completa** todos los campos del formulario
3. **Resuelve** el reCAPTCHA cuando aparezca
4. **Observa** que el botón "Registrarse" se habilita solo cuando:
   - ✅ Todos los campos son válidos
   - ✅ El reCAPTCHA está completado y verificado

## 🔍 Verificar funcionamiento

### Backend funcionando correctamente:
- Ve a http://localhost:8000 - deberías ver un mensaje de bienvenida JSON
- Ve a http://localhost:8000/docs - deberías ver la documentación de la API

### Frontend funcionando correctamente:
- El formulario debe cargar sin errores en la consola
- El widget de reCAPTCHA debe aparecer en la sección correspondiente
- La validación debe funcionar en tiempo real

## 🐛 Solución de problemas

### Error: "No se ha podido resolver la importación httpx"
```bash
pip install httpx
```

### Error: reCAPTCHA no aparece
- Verifica que tengas conexión a internet
- Abre las herramientas de desarrollador (F12) y revisa la consola por errores
- Asegúrate de que el script de Google se está cargando correctamente

### Error: CORS en el navegador
- Asegúrate de estar accediendo al frontend a través de un servidor web (no file://)
- El backend ya tiene configurado CORS para permitir todas las conexiones

### Error: El botón no se habilita
- Verifica que todos los campos del formulario sean válidos
- Asegúrate de que el reCAPTCHA esté completado
- Revisa la consola del navegador para ver el estado de validación

## 📊 Estados de validación

El formulario maneja los siguientes estados:

- ❌ **Campo inválido**: Borde rojo, mensaje de error visible
- ✅ **Campo válido**: Borde verde, sin mensaje de error
- 🤖 **reCAPTCHA pendiente**: Botón deshabilitado
- ✅ **reCAPTCHA completado**: Contribuye a habilitar el botón
- 🔒 **Botón habilitado**: Solo cuando TODOS los campos y reCAPTCHA son válidos

## 🎯 Flujo completo de validación

1. Usuario llena el formulario
2. Cada campo se valida en tiempo real
3. Usuario completa el reCAPTCHA
4. Frontend envía token al backend `/validate-recaptcha`
5. Backend verifica con Google reCAPTCHA API
6. Backend responde con éxito/fallo
7. Frontend habilita/mantiene deshabilitado el botón
8. Usuario puede enviar el formulario solo si todo es válido

## 📁 Archivos principales modificados/creados

- `backend.py` - ⭐ **NUEVO**: Servidor FastAPI para validación de reCAPTCHA
- `js/signup.js` - 🔄 **MODIFICADO**: Agregada funcionalidad de reCAPTCHA
- `sign_up.html` - 🔄 **MODIFICADO**: Agregado contenedor de reCAPTCHA
- `css/styles.css` - 🔄 **MODIFICADO**: Agregados estilos para reCAPTCHA
- `SETUP.md` - ⭐ **NUEVO**: Este archivo de instrucciones
