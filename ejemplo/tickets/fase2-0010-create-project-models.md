# Ticket: Crear Modelos de Proyecto

- **ID del Ticket:** `fase2-0010`
- **Fase:** Fase 2: Gestión de Proyectos (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Implementar los modelos de base de datos para `Project` y la tabla intermedia para `ProjectMember`, de acuerdo con la especificación. Estos modelos definirán la estructura de cómo se almacenan los proyectos y sus miembros.

---

## Criterios de Aceptación

- [ ] Se ha creado una nueva app de Django, `projects`.
- [ ] Se ha implementado el modelo `Project` con los campos `name`, `description`, `owner` y `created_at`/`updated_at`.
- [ ] El modelo `Project` tiene una relación `ManyToManyField` con el modelo `User` para gestionar los miembros, utilizando una tabla intermedia explícita si es necesario para campos adicionales como `date_joined`.
- [ ] Se han creado y aplicado las migraciones correspondientes.

---

## Especificaciones Relacionadas

- `docs/specs/02-project-management.md`

---

## Dependencias

- **Bloqueado por:** `fase1-0006-extend-user-model.md` 