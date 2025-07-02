# Plan de Ejecución del Proyecto

Este documento describe la hoja de ruta para el desarrollo de la aplicación de gestión de tareas. El proyecto se divide en fases lógicas para asegurar una construcción incremental y ordenada.

---

## Fase 0: Configuración del Proyecto y Cimientos

**Objetivo:** Preparar el entorno de desarrollo, la estructura del proyecto y las herramientas básicas.

- **Pasos:**
    1.  **Inicializar Repositorio Git:** Configurar el repositorio con un `.gitignore` adecuado para Python/Django y Node/React.
    2.  **Configuración de Docker:**
        - Crear `docker-compose.yml` para orquestar los servicios de `backend` (Django), `frontend` (React) y `db` (PostgreSQL).
        - Crear `Dockerfile` para el servicio de backend.
        - Crear `Dockerfile` para el servicio de frontend.
    3.  **Inicializar Backend (Django):**
        - Crear el proyecto Django y la app principal de `core`.
        - Configurar variables de entorno (ej. `python-decouple`).
        - Establecer la conexión a la base de datos PostgreSQL.
    4.  **Inicializar Frontend (React):**
        - Crear la aplicación React usando `create-react-app` o `Vite`.
        - Configurar la estructura de carpetas inicial (componentes, servicios, etc.).
    5.  **Configurar Linters y Formateadores:** Integrar `Black`, `Flake8` para el backend y `Prettier`, `ESLint` para el frontend.

---

## Fase 1: Sistema de Autenticación y Usuarios (Backend)

**Objetivo:** Implementar la lógica de negocio y los endpoints de la API para la gestión de usuarios.
**Referencia:** `docs/specs/01-auth-system.md`

- **Pasos:**
    1.  **Extender Modelo de Usuario:** Implementar el modelo `User` personalizado con el campo `role`.
    2.  **Configurar `Djoser` y `Simple JWT`:** Instalar y configurar las librerías para manejar los flujos de autenticación.
    3.  **Implementar Endpoints de Usuario:**
        - Asegurar que los endpoints de `Djoser` para registro, login, etc., funcionen correctamente.
        - Crear los endpoints para la gestión de usuarios por parte de los administradores (`/api/users/`).
    4.  **Escribir Pruebas:** Crear pruebas unitarias y de integración para los flujos de registro, login y obtención de perfil.

---

## Fase 2: Gestión de Proyectos (Backend)

**Objetivo:** Implementar la lógica para crear y gestionar proyectos.
**Referencia:** `docs/specs/02-project-management.md`

- **Pasos:**
    1.  **Crear Modelos de Proyecto:** Implementar los modelos `Project` y `ProjectMember`.
    2.  **Implementar Serializers:** Crear los `serializers` de Django REST Framework para los modelos de proyecto.
    3.  **Implementar Vistas y Permisos:** Crear los `ViewSets` para los endpoints de la API de proyectos y configurar los permisos personalizados (Owner, Member).
    4.  **Escribir Pruebas:** Probar la creación, actualización, eliminación y listado de proyectos, así como la gestión de miembros.

---

## Fase 3: Gestión de Tareas (Backend)

**Objetivo:** Implementar la funcionalidad principal de la aplicación: las tareas.
**Referencia:** `docs/specs/03-task-management.md`

- **Pasos:**
    1.  **Crear Modelo de Tarea:** Implementar el modelo `Task` con todos sus atributos.
    2.  **Implementar Serializers:** Crear `serializers` para el modelo `Task`.
    3.  **Implementar Vistas y Rutas Anidadas:** Crear los `ViewSets` para las tareas, asegurando que las rutas estén anidadas bajo proyectos (`/api/projects/{project_id}/tasks/`).
    4.  **Implementar Lógica de Negocio:** Asegurar que las validaciones y permisos a nivel de tarea funcionen correctamente.
    5.  **Escribir Pruebas:** Probar el CRUD completo de tareas y los filtros de listado.

---

## Fase 4: Implementación del Frontend (Core)

**Objetivo:** Construir la interfaz de usuario para las funcionalidades básicas desarrolladas en las fases 1-3.

- **Pasos:**
    1.  **Configurar Enrutamiento (React Router):** Definir las rutas públicas (login, registro) y privadas (dashboard).
    2.  **Gestión de Estado (Context API / Redux):** Implementar una solución para manejar el estado global (ej. estado de autenticación del usuario).
    3.  **Crear Vistas de Autenticación:** Desarrollar los formularios y la lógica para el registro y el login.
    4.  **Crear Vista de Proyectos:** Desarrollar la interfaz para listar, crear y ver proyectos.
    5.  **Crear Vista de Tablero de Tareas:** Implementar la vista principal donde los usuarios pueden ver y gestionar las tareas de un proyecto (ej. un tablero Kanban).

---

## Fase 5: Funcionalidades de Colaboración y Notificaciones (Backend y Frontend)

**Objetivo:** Añadir las características que enriquecen la interacción del usuario.
**Referencias:** `docs/specs/04-collaboration.md`, `docs/specs/05-notifications.md`

- **Pasos:**
    1.  **Backend - Comentarios y Adjuntos:**
        - Implementar los modelos, serializers y vistas para comentarios y adjuntos.
        - Configurar el almacenamiento de archivos (ej. S3).
        - Escribir pruebas.
    2.  **Backend - Notificaciones:**
        - Implementar el modelo de `Notification`.
        - Usar señales de Django (`post_save`) para generar notificaciones automáticamente según los eventos definidos.
        - Crear los endpoints de la API y escribir pruebas.
    3.  **Frontend - Integración:**
        - Integrar la sección de comentarios y adjuntos en la vista de detalle de la tarea.
        - Añadir un componente de notificaciones en la UI para mostrar las alertas al usuario.

---

## Fase 6: Pruebas, CI/CD y Despliegue

**Objetivo:** Asegurar la calidad del software, automatizar el flujo de trabajo y preparar para el lanzamiento.
**Referencia:** Requisitos de `prompts/instructions.md`

- **Pasos:**
    1.  **Expandir Cobertura de Pruebas:** Aumentar la cobertura de pruebas del backend y frontend a los niveles deseados.
    2.  **Configurar Pipeline de CI/CD:**
        - Crear un workflow de GitHub Actions que ejecute linters y pruebas en cada `push`.
        - Añadir un paso para construir y publicar las imágenes de Docker a un registro (ej. Docker Hub).
    3.  **Preparar para Producción:**
        - Crear una configuración de Docker y Django específica para producción (Gunicorn, Whitenoise, etc.).
        - Configurar un servidor o servicio en la nube (ej. AWS, DigitalOcean) para el despliegue.
    4.  **Despliegue Inicial.**

---
Fin del Documento 