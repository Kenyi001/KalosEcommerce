# Ticket 0001: Configurar Repositorio Git

**ID**: 0001  
**Título**: Configurar repositorio Git para Kalos E-commerce  
**Fase**: 0 - Configuración e Infraestructura  
**Sprint**: Sprint 0  
**Estimación**: 0.5 días  

## 📋 Descripción

Configurar el repositorio Git base para el proyecto Kalos E-commerce, incluyendo estructura inicial de carpetas, archivos de configuración y documentación básica.

## 🎯 Objetivos

- Establecer repositorio Git con estructura organizada
- Configurar archivos esenciales (.gitignore, README, etc.)
- Definir convenciones de commits y branches
- Crear documentación inicial del proyecto

## ✅ Criterios de Aceptación

### Estructura del Repositorio
- [ ] Crear estructura de carpetas inicial:
  ```
  /
  ├── docs/
  ├── src/
  ├── public/
  ├── tests/
  ├── scripts/
  └── .github/
  ```

### Archivos de Configuración
- [x] Crear `.gitignore` apropiado para proyecto web
- [x] Crear `README.md` con información del proyecto
- [ ] Crear `CONTRIBUTING.md` con guías de contribución
- [ ] Crear `LICENSE` con licencia MIT
- [ ] Crear `.github/ISSUE_TEMPLATE.md`
- [ ] Crear `.github/PULL_REQUEST_TEMPLATE.md`

### Documentación Base
- [x] Actualizar `README.md` con:
  - Descripción del proyecto Kalos
  - Stack tecnológico
  - Instrucciones de instalación
  - Guía de contribución básica
- [x] Crear documentación inicial en `/docs`

### Git Configuration
- [ ] Configurar branch protection rules
- [ ] Definir convenciones de commit (Conventional Commits)
- [ ] Configurar hooks básicos (pre-commit)
- [ ] Establecer workflow de branches (GitFlow)

## 🔧 Tareas Técnicas

### 1. Inicialización del Repositorio
```bash
# Comandos a ejecutar
git init
git remote add origin https://github.com/barbaritalaram/AIxDev.git
git branch -M main
```

### 2. Estructura de Carpetas
```bash
mkdir -p docs/{specs,guides,api}
mkdir -p src/{components,pages,config,utils,styles}
mkdir -p public/{images,icons,fonts}
mkdir -p tests/{unit,integration,e2e}
mkdir -p scripts/{build,deploy,utils}
mkdir -p .github/{workflows,ISSUE_TEMPLATE}
```

### 3. Archivos de Configuración

#### .gitignore
```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Firebase
.firebase/
firebase-debug.log

# Temporary files
*.tmp
*.temp
```

#### CONTRIBUTING.md
```markdown
# Contribuyendo a Kalos E-commerce

## Convenciones de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan funcionalidad)
- `refactor:` Refactoring de código
- `test:` Añadir o modificar tests
- `chore:` Tareas de mantenimiento

Ejemplo: `feat(auth): add Google Sign-In support`

## Workflow de Branches

1. `main` - Rama principal (producción)
2. `develop` - Rama de desarrollo
3. `feature/feature-name` - Nuevas funcionalidades
4. `hotfix/fix-name` - Correcciones urgentes

## Pull Request Process

1. Crear branch desde `develop`
2. Implementar cambios con tests
3. Actualizar documentación si es necesario
4. Crear PR hacia `develop`
5. Code review requerido
6. Merge tras aprobación
```

## 🧪 Tests y Validación

### Verificación Manual
- [ ] Repositorio cloneable desde GitHub
- [ ] Estructura de carpetas creada correctamente
- [ ] Archivos de configuración presentes
- [ ] README legible y completo
- [ ] .gitignore funcionando (archivos ignorados)

### Comandos de Verificación
```bash
# Verificar estructura
ls -la
tree -I node_modules

# Verificar git
git status
git log --oneline

# Verificar archivos ignorados
git check-ignore <file>
```

## 📦 Entregables

- [x] Repositorio Git configurado
- [x] Estructura de carpetas base
- [x] README.md actualizado para Kalos
- [x] .gitignore configurado
- [ ] Archivos de configuración GitHub
- [ ] Documentación de contribución
- [ ] Guías de desarrollo

## 🔗 Dependencias

### Bloquea
- **0002**: Configurar Docker (necesita estructura base)
- **0003**: Inicializar Firebase (necesita repo configurado)
- **0004**: Configurar frontend (necesita estructura)

### Dependencias Externas
- Cuenta GitHub activa
- Permisos de escritura en repositorio
- Git CLI instalado

## 📝 Notas de Implementación

### Decisiones Tomadas
- **Estructura de monorepo**: Frontend y backend en mismo repositorio
- **Conventional Commits**: Para generar changelogs automáticamente
- **MIT License**: Para permitir uso comercial
- **GitFlow workflow**: Para manejar features y releases

### Consideraciones Futuras
- **GitHub Actions**: Para CI/CD (ticket 0024)
- **Semantic Release**: Para versionado automático
- **Branch protection**: Configurar cuando hay más colaboradores
- **Issue templates**: Personalizar según necesidades del proyecto

### Problemas Conocidos
- Ninguno identificado por el momento

## ✅ Estado del Ticket

- **Estado**: [✅] Completado
- **Asignado a**: Equipo inicial
- **Tiempo real**: 0.5 días
- **Sprint**: Sprint 0
- **Fecha completado**: 2025-08-22

## 📋 Checklist Final

- [x] Repositorio Git inicializado
- [x] Estructura de carpetas creada
- [x] README.md completo y actualizado
- [x] .gitignore configurado
- [x] Documentación inicial creada
- [ ] Templates de GitHub configurados
- [ ] Guías de contribución definidas
- [ ] Branch protection habilitado

---

**Próximo ticket**: [0002 - Configurar Docker](fase0-0002-docker-setup.md)  
**Revisado por**: Pendiente  
**Aprobado por**: Pendiente
