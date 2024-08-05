# Usa una imagen base de Node.js
FROM node:18

# Crea un directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de configuración al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Recompilar módulos nativos para la plataforma de Docker
RUN npm rebuild bcrypt --build-from-source

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Copia el resto del código fuente al contenedor
COPY . .

# Expone el puerto en el que la aplicación está corriendo
EXPOSE 8080

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]
