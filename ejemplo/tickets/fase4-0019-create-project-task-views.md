# Ticket: Crear Vistas de Proyectos y Tareas en Frontend

- **ID del Ticket:** `fase4-0019`
- **Fase:** Fase 4: Implementación del Frontend (Core)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Desarrollar la interfaz de usuario principal donde los usuarios pueden ver sus proyectos y, al seleccionar uno, ver y gestionar las tareas asociadas. Esto incluye la creación de un dashboard de proyectos y una vista de tablero de tareas.

---

## Criterios de Aceptación

- [ ] Se ha creado una página de "Dashboard" o "/projects" que lista los proyectos del usuario autenticado, llamando al endpoint `GET /api/projects/`.
- [ ] La página de listado de proyectos permite crear un nuevo proyecto a través de un formulario/modal.
- [ ] Al hacer clic en un proyecto, el usuario es redirigido a la página del tablero de ese proyecto (`/projects/{id}`).
- [ ] La página del tablero de proyecto llama al endpoint `GET /api/projects/{project_id}/tasks/` para obtener y mostrar las tareas.
- [ ] Las tareas se muestran en un formato de tablero (ej. columnas "Pendiente", "En Progreso", "Completado").
- [ ] Existe funcionalidad para crear una nueva tarea dentro del proyecto.
- [ ] (Opcional) El usuario puede arrastrar y soltar tareas entre las columnas para actualizar su estado.

---

## Dependencias

- **Bloqueado por:** `fase2-0012-implement-project-views.md`, `fase3-0015-implement-task-views.md`, `fase4-0018-create-auth-views.md` 