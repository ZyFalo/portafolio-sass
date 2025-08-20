# Usar imagen base de nginx para servir archivos estáticos
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Crear directorio para logs si no existe
RUN mkdir -p /var/log/nginx

# Copiar archivos del proyecto al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Asegurar permisos correctos
RUN chmod -R 755 /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# El comando por defecto ya está configurado en la imagen nginx
CMD ["nginx", "-g", "daemon off;"]
