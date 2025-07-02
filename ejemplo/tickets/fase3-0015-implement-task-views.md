# Ticket: Implementar Serializers y Vistas de Tarea

- **ID del Ticket:** `fase3-0015`
- **Fase:** Fase 3: Gestión de Tareas (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Crear los `Serializers` y `ViewSets` para el modelo `Task`. La implementación debe incluir rutas anidadas bajo los proyectos para reflejar la relación jerárquica y simplificar la lógica de permisos.

---

## Criterios de Aceptación

- [ ] Se ha creado un `TaskSerializer` para el modelo `Task`, mostrando información relevante de los campos `ForeignKey` (como el nombre del `assignee`).
- [ ] Se ha creado un `TaskViewSet`.
- [ ] Se ha configurado el enrutamiento para que los endpoints de tareas sean anidados bajo proyectos (ej. `/api/projects/{project_id}/tasks/`). La librería `drf-nested-routers` puede ser útil aquí.
- [ ] El `ViewSet` filtra automáticamente las tareas para que solo pertenezcan al proyecto especificado en la URL.
- [ ] Se han implementado los permisos para asegurar que solo los miembros del proyecto puedan interactuar con sus tareas.

---

## Especificaciones Relacionadas

- `docs/specs/03-task-management.md`

---

## Dependencias

- **Bloqueado por:** `fase3-0014-create-task-model.md`
- **Bloquea:** `fase3-0016-write-task-tests.md` 