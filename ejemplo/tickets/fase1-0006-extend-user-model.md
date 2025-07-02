# Ticket: Extender Modelo de Usuario

- **ID del Ticket:** `fase1-0006`
- **Fase:** Fase 1: Sistema de Autenticación y Usuarios (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Extender el modelo de usuario abstracto de Django para incluir campos personalizados, como el campo `role`, según lo definido en la especificación. Este modelo de usuario será la base para el sistema de permisos de la aplicación.

---

## Criterios de Aceptación

- [ ] Se ha creado una nueva app de Django, por ejemplo `users`.
- [ ] Se ha creado un modelo `User` que hereda de `AbstractUser`.
- [ ] El modelo `User` incluye el campo `role` con las opciones `ADMIN` y `MEMBER`.
- [ ] El nuevo modelo de usuario está correctamente configurado en `settings.py` a través de `AUTH_USER_MODEL`.
- [ ] Se han creado y aplicado las migraciones correspondientes.

---

## Especificaciones Relacionadas

- `docs/specs/01-auth-system.md`

---

## Dependencias

- **Bloqueado por:** `fase0-0003-init-django-backend.md` 