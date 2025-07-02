# Ticket: Implementar Serializers de Proyecto

- **ID del Ticket:** `fase2-0011`
- **Fase:** Fase 2: Gestión de Proyectos (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Crear los `ModelSerializers` de Django REST Framework para los modelos de `Project` y `ProjectMember`. Estos serializers se encargarán de convertir los objetos del modelo a formato JSON para la API, y viceversa.

---

## Criterios de Aceptación

- [ ] Se ha creado un `ProjectSerializer` para el modelo `Project`.
- [ ] El `ProjectSerializer` muestra los detalles del `owner` y una lista de los `members`.
- [ ] Se ha creado un `ProjectMemberSerializer` o se ha anidado la información del miembro dentro del `ProjectSerializer` para mostrar los detalles de los miembros del proyecto.
- [ ] Los serializers gestionan correctamente las operaciones de creación y actualización (ej. campos de solo lectura como `created_at`).

---

## Especificaciones Relacionadas

- `docs/specs/02-project-management.md`

---

## Dependencias

- **Bloqueado por:** `fase2-0010-create-project-models.md` 