FROM node:22-alpine 
#nueva actualizacion de vite require 20.19+

WORKDIR /app

# Copiamos solo los archivos de dependencias primero (optimiza el caché)
COPY package.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del frontend
COPY . .

# Exponemos el puerto de Vite (por defecto 5173)
EXPOSE 5173

# Ejecutamos el servidor de desarrollo exponiéndolo a la red de Docker
CMD ["npm", "run", "dev", "--", "--host"]