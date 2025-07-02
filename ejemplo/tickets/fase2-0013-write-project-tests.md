# Ticket: Escribir Pruebas de Proyectos

- **ID del Ticket:** `fase2-0013`
- **Fase:** Fase 2: Gestión de Proyectos (Backend)
- **Estado:** Abierto
- **Prioridad:** Media

---

## Descripción

Crear pruebas de integración para el sistema de gestión de proyectos para asegurar que todos los endpoints de la API y la lógica de permisos funcionen correctamente.

---

## Criterios de Aceptación

- [ ] Hay pruebas que verifican la creación de un proyecto por un usuario autenticado.
- [ ] Hay pruebas que verifican que un usuario solo puede listar los proyectos de los que es miembro.
- [ ] Hay pruebas que verifican que solo el dueño de un proyecto puede actualizarlo o eliminarlo.
- [ ] Hay pruebas que verifican que un usuario no miembro no puede acceder a los detalles de un proyecto privado.
- [ ] Hay pruebas para el flujo de añadir y eliminar miembros de un proyecto, incluyendo los casos de permisos (solo el dueño puede hacerlo).

---

## Dependencias

- **Bloqueado por:** `fase2-0012-implement-project-views.md` 