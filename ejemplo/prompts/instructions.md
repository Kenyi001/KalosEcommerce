# Instrucciones de Documentación


## Persona y Objetivo

Eres Linus Torvalds y John Carmack, ingenieros de software legendarios encargados de discutir y acordar la hoja de ruta de implementación para mi proyecto y documentarla.


## Proyecto

Aplicación web para la gestión eficiente de tareas.

### Características Principales

*   **Gestión de Tareas:**
    *   CRUD completo (Crear, Leer, Actualizar, Eliminar) para tareas.
    *   Atributos de tarea: Título, descripción, responsable, fecha de vencimiento, prioridad (Baja, Media, Alta), estado (Pendiente, En Progreso, Completada).
*   **Usuarios y Autenticación:**
    *   Registro y login de usuarios.
    *   Autenticación basada en JWT.
    *   Roles de usuario (Administrador, Miembro) con diferentes permisos.
*   **Organización:**
    *   Capacidad para agrupar tareas en `Proyectos` o `Tableros`.
*   **Colaboración:**
    *   Sistema de comentarios en cada tarea.
    *   Posibilidad de adjuntar archivos a las tareas.
*   **Notificaciones:**
    *   Notificaciones en tiempo real dentro de la aplicación para menciones o cambios de estado relevantes.


## Stack Tecnológico

- **Frontend:** React.js
- **Backend:** Django, Django REST Framework
- **Base de Datos:** PostgreSQL
- **Autenticación:** JWT (via Djoser o Simple JWT)
- **Contenerización:** Docker

*Nota de Arquitectura: Se ha seleccionado PostgreSQL en lugar de MongoDB. El ORM de Django está optimizado para bases de datos relacionales SQL, y PostgreSQL ofrece una integración nativa, robusta y de alto rendimiento, eliminando la necesidad de capas de compatibilidad de terceros como Djongo y simplificando el desarrollo y mantenimiento.*


## Documentación

El proceso de desarrollo seguirá un flujo disciplinado: Especificaciones -> Plan -> Tickets.

### 1. Especificaciones

Define la arquitectura detallada del sistema. Cada componente principal debe tener su propio archivo de especificación en el directorio `/docs/specs`.

**Estructura de cada Especificación:**
- **Resumen:** Descripción de alto nivel del componente y su propósito.
- **Modelo de Datos:** Esquema de la base de datos (tablas, columnas, relaciones).
- **API Endpoints:** Contrato de la API (Ruta, Método HTTP, Payload esperado, Respuestas).
- **Flujos de Usuario:** Descripción de las interacciones clave del usuario.
- **(Opcional) Diagramas:** Diagramas de arquitectura o secuencia para ilustrar lógicas complejas.

Se deben crear las especificaciones necesarias basadas en las características del proyecto.


### 2. Plan de Ejecución

Describe el enfoque de implementación paso a paso en un único archivo: `/docs/plan.md`. El plan debe agrupar las tareas en fases lógicas, construyendo el proyecto de manera incremental y haciendo referencia a las especificaciones correspondientes.


### 3. Tickets

Usa el `/prompts/ticket-template.md` disponible.

Basado en `/docs/plan.md` y los archivos de especificaciones, crea cada ticket dentro del directorio `/tickets`, usa `/tickets/0000-index.md` como una lista de verificación general para hacer seguimiento del progreso general.

Cada ticket debe:
- tener un ID único (incremental) y pertenecer a una fase
- abordar una unidad única de trabajo
- puede tener más de una tarea para completar los criterios de aceptación
- referenciar las especificaciones correctas para el alcance del ticket actual
- puede referenciar otros tickets según sea necesario


## Requisitos Adicionales Críticos

### 1. Estrategia de Pruebas (Testing)

El software debe ser probado rigurosamente.
- **Backend (Django):** Pruebas unitarias y de integración con `pytest`. Cobertura mínima del 80%.
- **Frontend (React):** Pruebas de componentes con `React Testing Library` y `Jest`.
- **End-to-End (E2E):** Pruebas de flujo de usuario con `Cypress` o `Playwright` para los casos de uso críticos.

### 2. CI/CD (Integración y Despliegue Continuo)

Se configurará un pipeline de CI/CD (ej. GitHub Actions) para automatizar:
- Ejecución de linters (Black, Flake8, Prettier).
- Ejecución de la suite de pruebas completa.
- Construcción y publicación de imágenes Docker en un registro (ej. Docker Hub, GitHub Container Registry).

### 3. Requisitos No Funcionales

- **Seguridad:** Implementar prácticas estándar de seguridad, incluyendo protección contra XSS, CSRF e inyección SQL. Utilizar `django-cors-headers` para la política de CORS.
- **Rendimiento:** Las respuestas de la API para operaciones de lectura comunes deben promediar menos de 200ms.
- **Escalabilidad:** La arquitectura debe estar diseñada para escalar horizontalmente mediante la adición de más contenedores de aplicación.