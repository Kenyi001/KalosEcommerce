# Usa una imagen oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia package.json y package-lock.json
# (Estos archivos serán creados en un ticket posterior)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto 3000 para la aplicación de React
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"] 