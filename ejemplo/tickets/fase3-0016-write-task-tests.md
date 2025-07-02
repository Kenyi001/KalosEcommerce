# Ticket: Escribir Pruebas de Tareas

- **ID del Ticket:** `fase3-0016`
- **Fase:** Fase 3: Gestión de Tareas (Backend)
- **Estado:** Abierto
- **Prioridad:** Media

---

## Descripción

Crear pruebas de integración para el sistema de gestión de tareas. Las pruebas deben cubrir el CRUD completo de tareas y validar la lógica de negocio y los permisos asociados.

---

## Criterios de Aceptación

- [ ] Hay pruebas que verifican la creación de una tarea dentro de un proyecto por un miembro del proyecto.
- [ ] Hay pruebas que verifican que un usuario que no es miembro no puede crear ni ver tareas en un proyecto.
- [ ] Hay pruebas que validan la actualización de una tarea (cambio de estado, asignación, etc.).
- [ ] Hay pruebas para la lógica de permisos de eliminación (solo el reportero o el dueño del proyecto pueden eliminar).
- [ ] Hay pruebas que validan que el endpoint de listado de tareas (`/api/projects/{project_id}/tasks/`) solo devuelve tareas del proyecto correcto.

---

## Especificaciones Relacionadas

- `docs/specs/03-task-management.md`

---

## Dependencias

- **Bloqueado por:** `fase3-0015-implement-task-views.md` 