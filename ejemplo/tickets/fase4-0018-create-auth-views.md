# Ticket: Crear Vistas de Autenticación en Frontend

- **ID del Ticket:** `fase4-0018`
- **Fase:** Fase 4: Implementación del Frontend (Core)
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Desarrollar los componentes y la lógica de la interfaz de usuario para que los usuarios puedan registrarse e iniciar sesión en la aplicación, interactuando con los endpoints de la API de autenticación del backend.

---

## Criterios de Aceptación

- [ ] Se ha creado una página de `Login` con un formulario para email y contraseña.
- [ ] La página de `Login` llama al endpoint `/api/auth/jwt/create/` y, en caso de éxito, guarda los tokens y redirige al dashboard.
- [ ] Se ha creado una página de `Registro` con un formulario para los datos del nuevo usuario.
- [ ] La página de `Registro` llama al endpoint `/api/auth/users/` y, en caso de éxito, redirige a la página de login.
- [ ] Se manejan y muestran adecuadamente los errores de la API (ej. "credenciales inválidas", "el email ya existe").
- [ ] Existe una función de `logout` que borra los tokens de autenticación y redirige a la página de login.

---

## Dependencias

- **Bloqueado por:** `fase1-0007-setup-djoser-jwt.md`, `fase4-0017-setup-frontend-routing-state.md` 