# Ticket Fase 0-0002: Configuración Docker (Opcional)

## 📋 Descripción
Configurar entorno Docker opcional para desarrollo local consistente del proyecto Kalos E-commerce, incluyendo contenedores para desarrollo y Firebase emulators.

## 🎯 Objetivos
- Entorno de desarrollo containerizado y reproducible
- Docker setup para Firebase emulators
- Configuración para desarrollo local sin dependencias globales
- Scripts de desarrollo optimizados
- Documentación para setup con/sin Docker

## 📊 Criterios de Aceptación

### ✅ Docker Configuration
- [ ] Dockerfile para entorno de desarrollo
- [ ] docker-compose.yml para servicios completos
- [ ] Container para Firebase emulators
- [ ] Volume mapping para live reload
- [ ] Network configuration para servicios

### ✅ Development Environment
- [ ] Node.js 18+ en container
- [ ] Vite dev server configurado
- [ ] Firebase CLI y emulators
- [ ] Hot reload funcional
- [ ] Port mapping correcto (5173, 9099, 8080, etc.)

### ✅ Scripts y Automation
- [ ] Scripts npm para Docker workflow
- [ ] Makefile o scripts bash para comandos
- [ ] Backup y restore de datos emulators
- [ ] Health checks para servicios

## 🔧 Implementación

### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

# Install Firebase CLI
RUN npm install -g firebase-tools

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose ports
EXPOSE 5173 9099 8080 9000 4000

# Development command
CMD ["npm", "run", "dev"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  # Main application
  kalos-app:
    build: .
    ports:
      - "5173:5173"    # Vite dev server
      - "9099:9099"    # Firebase Auth emulator
      - "8080:8080"    # Firestore emulator
      - "9199:9199"    # Firebase Storage emulator
      - "4000:4000"    # Firebase emulator UI
    volumes:
      - .:/app
      - /app/node_modules
      - firebase-data:/app/.firebase-emulators
    environment:
      - NODE_ENV=development
      - VITE_FIREBASE_USE_EMULATOR=true
    command: npm run dev:docker
    networks:
      - kalos-network

  # Firebase Emulators (standalone option)
  firebase-emulators:
    image: node:18-alpine
    working_dir: /app
    ports:
      - "9099:9099"
      - "8080:8080"
      - "9199:9199"
      - "4000:4000"
    volumes:
      - .:/app
      - firebase-data:/app/.firebase-emulators
    command: >
      sh -c "npm install -g firebase-tools &&
             firebase emulators:start --only auth,firestore,storage,ui"
    networks:
      - kalos-network

volumes:
  firebase-data:

networks:
  kalos-network:
    driver: bridge
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "dev:docker": "vite --host 0.0.0.0",
    "docker:build": "docker-compose build",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "docker:shell": "docker-compose exec kalos-app sh",
    "firebase:emulators": "firebase emulators:start",
    "firebase:emulators:export": "firebase emulators:export ./firebase-export",
    "firebase:emulators:import": "firebase emulators:start --import ./firebase-export"
  }
}
```

### Makefile (Opcional)
```makefile
# Makefile
.PHONY: help build up down logs shell clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build Docker containers
	docker-compose build

up: ## Start development environment
	docker-compose up -d

down: ## Stop development environment
	docker-compose down

logs: ## Show logs
	docker-compose logs -f

shell: ## Access container shell
	docker-compose exec kalos-app sh

clean: ## Clean Docker containers and volumes
	docker-compose down -v
	docker system prune -f

dev: ## Start development (with Docker)
	docker-compose up

dev-native: ## Start development (without Docker)
	npm run dev

firebase-export: ## Export Firebase emulator data
	npm run firebase:emulators:export

firebase-import: ## Import Firebase emulator data
	npm run firebase:emulators:import
```

### Docker Configuration Files

#### .dockerignore
```dockerignore
node_modules
npm-debug.log*
.git
.gitignore
README.md
.nyc_output
coverage
.vite
dist
.firebase
firebase-debug.log
.env.local
.env.production
```

#### docker-compose.override.yml (for local customization)
```yaml
version: '3.8'

services:
  kalos-app:
    environment:
      - DEBUG=true
      - LOG_LEVEL=debug
    volumes:
      - ./src:/app/src:cached
      - ./public:/app/public:cached
```

## 🧪 Testing

### Docker Environment Testing
```bash
# Test Docker setup
docker-compose up -d
docker-compose ps
curl http://localhost:5173

# Test Firebase emulators
curl http://localhost:4000  # Emulator UI
curl http://localhost:9099  # Auth emulator
curl http://localhost:8080  # Firestore emulator

# Test volume mounting
docker-compose exec kalos-app ls -la /app
docker-compose exec kalos-app npm --version
```

### Development Workflow Testing
```bash
# Test hot reload
echo "console.log('test');" >> src/main.js
# Should see changes reflected immediately

# Test Firebase emulators
npm run firebase:emulators:export
npm run firebase:emulators:import
```

## 📋 Setup Instructions

### Option 1: With Docker
```bash
# Clone repository
git clone https://github.com/usuario/kalos-ecommerce.git
cd kalos-ecommerce

# Build and start
docker-compose up --build

# Access application
open http://localhost:5173

# Access Firebase emulator UI
open http://localhost:4000
```

### Option 2: Without Docker (Standard)
```bash
# Clone repository
git clone https://github.com/usuario/kalos-ecommerce.git
cd kalos-ecommerce

# Install dependencies
npm install

# Start development
npm run dev

# Start Firebase emulators (separate terminal)
firebase emulators:start
```

### Switching Between Environments
```bash
# Use Docker environment
export USE_DOCKER=true
npm run dev:docker

# Use native environment
export USE_DOCKER=false
npm run dev
```

## 🚀 Deployment

### Production Considerations
- Docker setup es solo para desarrollo
- Production usa Firebase Hosting
- CI/CD puede usar Docker para tests
- Environment variables diferentes por entorno

### CI/CD Integration
```yaml
# .github/workflows/test.yml (ejemplo)
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker
        run: docker-compose build
      - name: Run tests
        run: docker-compose run kalos-app npm test
```

## 📦 Dependencies
- Docker 20+
- Docker Compose 2+
- Node.js 18+ (si no se usa Docker)
- Firebase CLI (si no se usa Docker)

## 🔗 Relaciones
- **Depende de**: fase0-0001-init-git-repo
- **Opcional para**: Todo el desarrollo
- **Mejora**: Developer experience y consistency

## 📝 Notas Adicionales

### Pros del Docker Setup
- ✅ Entorno consistente entre desarrolladores
- ✅ No requiere instalación local de Node/Firebase CLI
- ✅ Fácil setup para nuevos developers
- ✅ Isolation de dependencies

### Contras del Docker Setup
- ❌ Overhead de performance en Windows/Mac
- ❌ Complejidad adicional para debugging
- ❌ Requires Docker knowledge
- ❌ Slower file watching en algunos sistemas

### Recomendación
**Docker es OPCIONAL** para este proyecto. El desarrollo nativo con Node.js + Firebase CLI es más directo y rápido para la mayoría de casos. Usar Docker solo si:
- Equipo requiere consistencia absoluta
- Problemas con versiones locales de Node
- CI/CD requiere containerization

---

**Estado**: 🟡 Opcional  
**Prioridad**: Baja  
**Estimación**: 3 horas  
**Asignado**: DevOps/Developer  

**Sprint**: Sprint 0 - Foundation  
**Deadline**: Opcional - según necesidad del equipo
