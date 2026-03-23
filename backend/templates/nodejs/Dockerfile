FROM node:18-alpine
WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .
COPY userCode.js . 

EXPOSE 3000
CMD ["node", "server.js"]