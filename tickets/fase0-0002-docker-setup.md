# Ticket 0002: Configurar Docker y Entorno de Desarrollo

**ID**: 0002  
**Título**: Configurar Docker y entorno de desarrollo para Kalos E-commerce  
**Fase**: 0 - Configuración e Infraestructura  
**Sprint**: Sprint 0  
**Estimación**: 1 día  

## 📋 Descripción

Configurar Docker para crear un entorno de desarrollo consistente y reproducible para el proyecto Kalos E-commerce. Incluir configuración para desarrollo local con hot reload y servicios de base de datos.

## 🎯 Objetivos

- Crear entorno de desarrollo con Docker Compose
- Configurar hot reload para desarrollo
- Establecer servicios necesarios (Firebase Emulator)
- Documentar proceso de setup para desarrolladores

## ✅ Criterios de Aceptación

### Configuración Docker
- [ ] Crear `Dockerfile` para desarrollo
- [ ] Crear `docker-compose.yml` para servicios completos
- [ ] Configurar volúmenes para hot reload
- [ ] Incluir Firebase Emulator Suite

### Servicios de Desarrollo
- [ ] Contenedor principal de desarrollo
- [ ] Firebase Emulator (Auth, Firestore, Storage)
- [ ] Servidor de desarrollo Vite
- [ ] Variables de entorno configuradas

### Scripts y Documentación
- [ ] Scripts de inicio rápido (`npm run docker:dev`)
- [ ] Documentación en README actualizada
- [ ] Guía de troubleshooting
- [ ] Comandos útiles documentados

### Testing
- [ ] Entorno arranca sin errores
- [ ] Hot reload funcional
- [ ] Firebase Emulator accesible
- [ ] Puertos correctamente mapeados

## 🔧 Tareas Técnicas

### 1. Dockerfile para Desarrollo
```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# Instalar herramientas globales
RUN npm install -g firebase-tools

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puertos
EXPOSE 5173 9099 8080 4000 4400 4500 5001

# Comando por defecto
CMD ["npm", "run", "dev"]
```

### 2. Docker Compose Configuration
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Aplicación principal
  kalos-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: kalos-app
    ports:
      - "5173:5173"     # Vite dev server
      - "9099:9099"     # Firebase Auth Emulator
      - "8080:8080"     # Firestore Emulator
      - "4000:4000"     # Firebase Emulator Suite UI
      - "4400:4400"     # Firebase Hosting Emulator
      - "4500:4500"     # Firebase Emulator Hub
      - "5001:5001"     # Firebase Functions Emulator
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_USE_FIREBASE_EMULATOR=true
      - VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
      - VITE_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
      - VITE_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
    command: npm run dev:docker
    depends_on:
      - firebase-emulator

  # Firebase Emulator Suite
  firebase-emulator:
    build:
      context: .
      dockerfile: Dockerfile.firebase
    container_name: kalos-firebase
    ports:
      - "9099:9099"     # Auth
      - "8080:8080"     # Firestore  
      - "9199:9199"     # Storage
      - "4000:4000"     # UI
    volumes:
      - ./firebase.json:/app/firebase.json
      - ./firestore.rules:/app/firestore.rules
      - ./storage.rules:/app/storage.rules
      - firebase-data:/app/data
    command: firebase emulators:start --import=/app/data --export-on-exit=/app/data

volumes:
  firebase-data:
```

### 3. Dockerfile para Firebase Emulator
```dockerfile
# Dockerfile.firebase
FROM node:18-alpine

WORKDIR /app

# Instalar Firebase CLI
RUN npm install -g firebase-tools

# Copiar archivos de configuración
COPY firebase.json ./
COPY firestore.rules ./
COPY storage.rules ./

# Crear directorio para datos
RUN mkdir -p data

EXPOSE 4000 8080 9099 9199

CMD ["firebase", "emulators:start", "--host", "0.0.0.0"]
```

### 4. Scripts en Package.json
```json
{
  "scripts": {
    "dev": "vite",
    "dev:docker": "vite --host 0.0.0.0",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:clean": "docker-compose down -v --rmi all",
    "emulators": "firebase emulators:start",
    "emulators:ui": "firebase emulators:start --import=./firebase-data",
    "setup": "npm install && npm run docker:build"
  }
}
```

### 5. Configuración de Firebase
```json
// firebase.json
{
  "emulators": {
    "auth": {
      "port": 9099,
      "host": "0.0.0.0"
    },
    "firestore": {
      "port": 8080,
      "host": "0.0.0.0"
    },
    "storage": {
      "port": 9199,
      "host": "0.0.0.0"
    },
    "hosting": {
      "port": 4400,
      "host": "0.0.0.0"
    },
    "ui": {
      "enabled": true,
      "port": 4000,
      "host": "0.0.0.0"
    },
    "hub": {
      "port": 4500,
      "host": "0.0.0.0"
    }
  }
}
```

### 6. Variables de Entorno
```bash
# .env.docker
NODE_ENV=development
VITE_USE_FIREBASE_EMULATOR=true
VITE_FIREBASE_API_KEY=demo-api-key
VITE_FIREBASE_AUTH_DOMAIN=demo-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=demo-project
VITE_FIREBASE_STORAGE_BUCKET=demo-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# Emulator hosts
VITE_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
VITE_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
VITE_FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```

## 📝 Documentación Actualizada

### README.md - Sección Docker
```markdown
## 🐳 Desarrollo con Docker

### Prerrequisitos
- Docker y Docker Compose instalados
- Git configurado

### Inicio Rápido
```bash
# Clonar repositorio
git clone https://github.com/barbaritalaram/AIxDev.git
cd AIxDev

# Configurar y ejecutar
npm run setup
npm run docker:up

# Acceder a la aplicación
# Frontend: http://localhost:5173
# Firebase UI: http://localhost:4000
```

### Comandos Útiles
```bash
# Iniciar servicios
npm run docker:up

# Ver logs
npm run docker:logs

# Parar servicios
npm run docker:down

# Limpiar todo
npm run docker:clean

# Reconstruir contenedores
npm run docker:build
```

### URLs de Desarrollo
- **Frontend**: http://localhost:5173
- **Firebase Emulator UI**: http://localhost:4000
- **Firestore Emulator**: http://localhost:8080
- **Auth Emulator**: http://localhost:9099
- **Storage Emulator**: http://localhost:9199
```

## 🧪 Tests y Validación

### Verificaciones Manuales
- [ ] `docker-compose up` ejecuta sin errores
- [ ] Frontend accesible en puerto 5173
- [ ] Firebase Emulator UI funcional en puerto 4000
- [ ] Hot reload funciona al cambiar archivos
- [ ] Variables de entorno cargadas correctamente

### Scripts de Verificación
```bash
#!/bin/bash
# scripts/verify-docker.sh

echo "🔍 Verificando configuración Docker..."

# Verificar que Docker está corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está corriendo"
    exit 1
fi

# Construir y ejecutar
echo "🏗️ Construyendo contenedores..."
docker-compose build

echo "🚀 Iniciando servicios..."
docker-compose up -d

# Esperar que servicios estén listos
echo "⏳ Esperando servicios..."
sleep 10

# Verificar endpoints
endpoints=(
    "http://localhost:5173"
    "http://localhost:4000"
    "http://localhost:8080"
    "http://localhost:9099"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f $endpoint > /dev/null 2>&1; then
        echo "✅ $endpoint - OK"
    else
        echo "❌ $endpoint - FAIL"
    fi
done

echo "🎉 Verificación completa"
```

## 📦 Entregables

- [ ] `Dockerfile.dev` configurado
- [ ] `docker-compose.yml` funcional
- [ ] Scripts npm para Docker
- [ ] Configuración Firebase Emulator
- [ ] Variables de entorno de desarrollo
- [ ] Documentación actualizada
- [ ] Scripts de verificación

## 🔗 Dependencias

### Requiere
- **0001**: Configurar repositorio Git (estructura base)

### Bloquea
- **0003**: Inicializar Firebase (necesita emulator)
- **0004**: Configurar frontend (necesita entorno)
- **0005**: Setup linters (necesita entorno base)

### Dependencias Externas
- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Firebase CLI (se instala en contenedor)

## 📝 Notas de Implementación

### Decisiones Tomadas
- **Node 18 Alpine**: Balance entre tamaño y funcionalidad
- **Volúmenes para hot reload**: Desarrollo eficiente
- **Separar Firebase Emulator**: Modularidad y debugging
- **Puerto mapping explícito**: Claridad para desarrolladores

### Consideraciones de Performance
- **Multi-stage builds**: Para optimizar en producción
- **Volume caching**: node_modules en volumen separado
- **Network optimization**: Servicios en misma red

### Troubleshooting Común
- **Puerto ocupado**: Verificar procesos en puertos 5173, 4000, 8080
- **Permisos**: En Linux, puede requerir sudo para Docker
- **Hot reload no funciona**: Verificar bind mounts en Windows/Mac
- **Firebase emulator error**: Verificar firebase.json y reglas

### Mejoras Futuras
- **Development vs Production**: Dockerfiles separados
- **Health checks**: Para verificar estado de servicios
- **Resource limits**: CPU y memoria para desarrollo
- **SSL local**: Para testing HTTPS features

## ✅ Estado del Ticket

- **Estado**: [🔄] En Progreso
- **Asignado a**: Equipo DevOps
- **Tiempo estimado**: 1 día
- **Sprint**: Sprint 0
- **Iniciado**: 2025-08-22

## 📋 Progreso de Tareas

- [ ] Crear Dockerfile.dev
- [ ] Configurar docker-compose.yml  
- [ ] Setup Firebase Emulator container
- [ ] Configurar variables de entorno
- [ ] Crear scripts npm
- [ ] Actualizar documentación
- [ ] Testing y validación
- [ ] Scripts de verificación

## 🔄 Próximos Pasos

1. **Completar configuración Docker**
2. **Verificar funcionamiento en diferentes OS**
3. **Documentar troubleshooting común**
4. **Preparar para ticket 0003 (Firebase)**

---

**Próximo ticket**: [0003 - Inicializar Firebase](fase0-0003-init-firebase-backend.md)  
**Dependiente de**: [0001 - Configurar Git](fase0-0001-init-git-repo.md)  
**Revisado por**: Pendiente
