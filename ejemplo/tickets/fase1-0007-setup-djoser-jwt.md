# Ticket: Configurar Djoser y Simple JWT

- **ID del Ticket:** `fase1-0007`
- **Fase:** Fase 1: Sistema de Autenticación y Usuarios (Backend)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Instalar y configurar las librerías `Djoser` y `djangorestframework-simplejwt` para manejar la mayor parte de la lógica de autenticación (registro, login, logout, etc.) a través de endpoints de API basados en JSON Web Tokens.

---

## Criterios de Aceptación

- [ ] Las librerías `djoser` y `djangorestframework-simplejwt` están añadidas a las dependencias del backend.
- [ ] Django REST Framework está configurado para usar `Simple JWT` como su sistema de autenticación por defecto.
- [ ] `Djoser` está configurado para usar `Simple JWT`.
- [ ] Las rutas de la API para `Djoser` (ej. `/api/auth/`) están incluidas en el `urls.py` principal.
- [ ] La configuración de `Djoser` está ajustada para funcionar con el modelo de usuario personalizado y usar el `email` como campo de login.

---

## Especificaciones Relacionadas

- `docs/specs/01-auth-system.md`

---

## Dependencias

- **Bloqueado por:** `fase1-0006-extend-user-model.md` 