FROM node:18-alpine

# Instalamos el cliente de Docker dentro del contenedor del backend para que pueda ejecutar comandos 
RUN apk add --no-cache docker-cli

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5500

CMD ["node", "index.js"]