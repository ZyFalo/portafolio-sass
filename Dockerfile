# Usar imagen base de nginx para servir archivos estáticos
FROM nginx:alpine

# Copiar archivos del proyecto al directorio de nginx
COPY . /usr/share/nginx/html

# Copiar configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer el puerto 80
EXPOSE 80

# El comando por defecto ya está configurado en la imagen nginx
CMD ["nginx", "-g", "daemon off;"]
