# Ticket: Crear Modelo de Tarea

- **ID del Ticket:** `fase3-0014`
- **Fase:** Fase 3: Gestión de Tareas (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Implementar el modelo de base de datos para `Task`, que es la entidad central de la aplicación. El modelo incluirá todos los atributos definidos en la especificación, como estado, prioridad y asignaciones.

---

## Criterios de Aceptación

- [ ] Se ha creado una nueva app de Django, `tasks`.
- [ ] Se ha implementado el modelo `Task` con todos sus campos: `project`, `title`, `description`, `status`, `priority`, `assignee`, `reporter`, `due_date`, etc.
- [ ] Las relaciones `ForeignKey` (`project`, `assignee`, `reporter`) apuntan a los modelos correctos.
- [ ] Se han definido los `choices` para los campos `status` y `priority`.
- [ ] Se han creado y aplicado las migraciones correspondientes.

---

## Especificaciones Relacionadas

- `docs/specs/03-task-management.md`

---

## Dependencias

- **Bloqueado por:** `fase2-0010-create-project-models.md` 