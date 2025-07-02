# Ticket: Implementar Endpoints de Usuario

- **ID del Ticket:** `fase1-0008`
- **Fase:** Fase 1: Sistema de Autenticación y Usuarios (Backend)
- **Estado:** Abierto
- **Prioridad:** Media

---

## Descripción

Crear los endpoints de la API necesarios para que los administradores puedan gestionar usuarios (listar, ver detalles, actualizar, eliminar), como se describe en la especificación.

---

## Criterios de Aceptación

- [ ] Se ha creado un `UserSerializer` que no expone información sensible como el hash de la contraseña.
- [ ] Se ha creado un `ViewSet` para el modelo `User`.
- [ ] El `ViewSet` está protegido y solo es accesible por usuarios con el rol `ADMIN`.
- [ ] Se ha implementado el endpoint `GET /api/users/` para listar todos los usuarios.
- [ ] Se han implementado los endpoints `GET`, `PUT`, `PATCH`, `DELETE` en `/api/users/{id}/` para gestionar un usuario específico.

---

## Especificaciones Relacionadas

- `docs/specs/01-auth-system.md`

---

## Dependencias

- **Bloqueado por:** `fase1-0007-setup-djoser-jwt.md` 