# Ticket #0002: Configuración Docker - Entorno de Desarrollo

**Estado:** 📋 Planificado  
**Prioridad:** Media  
**Estimación:** 1 día  
**Fase:** 0 - Setup y Configuración  
**Asignado a:** DevOps Team  

---

## 📋 Descripción

Configurar Docker para desarrollo local del proyecto Kalos E-commerce, facilitando la configuración del entorno y asegurando consistencia entre desarrolladores.

## 🎯 Objetivos

### Funcionales
- Docker Compose para desarrollo local
- Servicios necesarios containerizados
- Hot reload funcional para desarrollo
- Base de datos local para testing
- Configuración fácil para nuevos desarrolladores

### Técnicos
- Docker Compose configurado
- Servicios aislados y reproducibles
- Volúmenes para persistencia de datos
- Network configuration apropiada
- Health checks implementados

## 🔧 Tareas Técnicas

### Docker Configuration
- [ ] Crear Dockerfile para la aplicación
- [ ] Configurar docker-compose.yml
- [ ] Setup de servicios necesarios (DB, Redis, etc.)
- [ ] Configurar volúmenes para desarrollo
- [ ] Network configuration entre servicios

### Development Environment
- [ ] Hot reload configurado
- [ ] Environment variables management
- [ ] Port mapping apropiado
- [ ] Logging configuration
- [ ] Health checks para servicios

## 🐳 Docker Configuration

### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 5173

# Start application
CMD ["npm", "run", "dev", "--", "--host"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_ENABLE_EMULATORS=true
    depends_on:
      - firebase-emulator
    networks:
      - kalos-network

  firebase-emulator:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "4000:4000"  # Emulator UI
      - "8080:8080"  # Firestore
      - "9099:9099"  # Auth
      - "9199:9199"  # Storage
    volumes:
      - .:/app
    command: npx firebase emulators:start --only auth,firestore,storage
    networks:
      - kalos-network

  # Optional: Redis for caching
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - kalos-network

networks:
  kalos-network:
    driver: bridge

volumes:
  redis_data:
```

### Docker Compose Development
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
    command: npm run dev
```

## 🧪 Criterios de Aceptación

### Funcionalidad
- [ ] `docker-compose up` levanta todo el entorno
- [ ] Hot reload funciona correctamente
- [ ] Aplicación accesible en http://localhost:5173
- [ ] Firebase emulators funcionan correctamente
- [ ] Logs visibles y útiles

### Performance
- [ ] Tiempo de startup <2 minutos
- [ ] Hot reload <3 segundos
- [ ] Uso eficiente de recursos
- [ ] Volúmenes optimizados

### Developer Experience
- [ ] Comandos simples para development
- [ ] Documentación clara de uso
- [ ] Debugging funcional
- [ ] Easy cleanup y reset

## 📝 Comandos Útiles

```bash
# Levantar entorno completo
docker-compose up -d

# Solo la aplicación
docker-compose up app

# Logs en tiempo real
docker-compose logs -f app

# Rebuild con cambios
docker-compose up --build

# Limpiar todo
docker-compose down -v --remove-orphans

# Acceso a shell del container
docker-compose exec app sh

# Reset completo
docker-compose down -v
docker system prune -f
```

## 🔧 Scripts NPM Adicionales

```json
{
  "scripts": {
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:rebuild": "docker-compose up --build",
    "docker:logs": "docker-compose logs -f",
    "docker:clean": "docker-compose down -v --remove-orphans"
  }
}
```

## 📝 Notas de Implementación

### Consideraciones
- **Volumes**: Usar bind mounts para development, named volumes para data
- **Networking**: Servicios deben comunicarse por service names
- **Environment**: Diferentes configs para dev/staging/prod
- **Security**: No exponer puertos innecesarios en producción

### Troubleshooting
```bash
# Si hay problemas de permisos
docker-compose exec app chown -R node:node /app

# Si hay problemas de cache
docker-compose down -v
docker system prune -f

# Ver uso de recursos
docker stats

# Ver networks
docker network ls
```

## 🔗 Dependencias

### Técnicas
- ✅ Git repository configurado (#0001)
- ⚠️ Docker y Docker Compose instalados
- ⚠️ Firebase CLI configurado

### Herramientas Requeridas
- Docker Desktop (Windows/Mac) o Docker Engine (Linux)
- Docker Compose
- Al menos 4GB RAM disponible
- Puertos 4000, 5173, 8080, 9099, 9199 disponibles

## 🚀 Criterios de Deploy

- [ ] Docker configuration funcional en múltiples sistemas
- [ ] Documentación actualizada con instrucciones Docker
- [ ] Team training completado
- [ ] Troubleshooting guide documentado

---

**Tags:** `docker` `development` `infrastructure` `devops`  
**Relacionado:** #0001, #0003
