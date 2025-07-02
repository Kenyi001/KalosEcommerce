# Ticket: Escribir Pruebas de Autenticación

- **ID del Ticket:** `fase1-0009`
- **Fase:** Fase 1: Sistema de Autenticación y Usuarios (Backend)
- **Estado:** Abierto
- **Prioridad:** Media

---

## Descripción

Crear un conjunto inicial de pruebas unitarias y de integración para el sistema de autenticación y usuarios. Las pruebas son fundamentales para garantizar que la lógica de negocio funciona como se espera y para prevenir regresiones futuras.

---

## Criterios de Aceptación

- [ ] Se ha configurado `pytest` y `pytest-django` en el proyecto.
- [ ] Hay pruebas que verifican el proceso de creación de un nuevo usuario.
- [ ] Hay pruebas que verifican el proceso de login con credenciales correctas e incorrectas.
- [ ] Hay pruebas que verifican que el endpoint `/api/auth/users/me/` devuelve los datos del usuario autenticado.
- [ ] Hay pruebas que verifican que los endpoints de gestión de usuarios (`/api/users/`) están correctamente protegidos por el rol de administrador.

---

## Dependencias

- **Bloqueado por:** `fase1-0008-implement-user-endpoints.md` 