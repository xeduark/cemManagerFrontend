FROM node:22-alpine

WORKDIR /app

# Copiar archivos de dependencias primero para aprovechar la caché de Docker
COPY package*.json ./

RUN npm install

# Copiar el resto del código del frontend
COPY . .

# Exponer el puerto estándar de desarrollo
EXPOSE 3000

# Comando para iniciar en modo desarrollo
CMD ["npm", "run", "dev"]
