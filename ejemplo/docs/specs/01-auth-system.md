# Especificación del Sistema: Autenticación y Gestión de Usuarios

- **ID:** `SPEC-001`
- **Componente:** `Auth & User Management`
- **Estado:** `Borrador`

---

## 1. Resumen

Este documento describe el sistema responsable del registro, autenticación y gestión de usuarios en la plataforma. Este sistema es la base para el control de acceso y la personalización de la experiencia del usuario. Utilizará tokens JWT (JSON Web Tokens) para la autenticación de la API y la librería `Djoser` para gestionar los flujos de autenticación estándar.

## 2. Modelo de Datos

### Tabla: `users_user`

Se extenderá el modelo de usuario abstracto de Django.

| Nombre de Columna | Tipo de Dato       | Restricciones / Notas                                |
| ----------------- | ------------------ | ---------------------------------------------------- |
| `id`              | UUID               | Llave primaria, autogenerada.                      |
| `password`        | VARCHAR(128)       | Hasheada por Django.                                 |
| `last_login`      | DATETIME           | Fecha del último inicio de sesión.                   |
| `is_superuser`    | BOOLEAN            | Designa si el usuario tiene todos los permisos.    |
| `email`           | VARCHAR(254)       | **Requerido**, Único. Usado para el login.           |
| `first_name`      | VARCHAR(150)       | Opcional.                                            |
| `last_name`       | VARCHAR(150)       | Opcional.                                            |
| `is_staff`        | BOOLEAN            | Designa si el usuario puede acceder al admin site. |
| `is_active`       | BOOLEAN            | Designa si la cuenta está activa. Default: `True`. |
| `date_joined`     | DATETIME           | Fecha de creación de la cuenta.                      |
| `role`            | VARCHAR(50)        | Rol del usuario. Opciones: `ADMIN`, `MEMBER`. Default: `MEMBER`. |


## 3. Roles y Permisos

| Rol         | Descripción                                                                                                                              |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `ADMIN`     | Tiene acceso completo a todas las funcionalidades. Puede gestionar usuarios (CRUD), proyectos (CRUD) y tareas (CRUD) en todo el sistema. |
| `MEMBER`    | Rol estándar. Puede crear proyectos, gestionar las tareas de los proyectos a los que pertenece y ver otros usuarios y proyectos.         |

## 4. API Endpoints

Los siguientes endpoints serán proporcionados principalmente por `Djoser` y `Simple JWT`.

| Funcionalidad             | Método HTTP | Ruta de API                  | Autenticación Requerida | Payload de Petición (JSON)                                | Respuesta Exitosa (2xx)                                               |
| ------------------------- | ----------- | ---------------------------- | ----------------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| **Registro de Usuario**   | `POST`      | `/api/auth/users/`           | No                      | `{ "email", "password", "first_name", "last_name" }`      | `201 Created` - `{ "id", "email", "first_name", "last_name" }`        |
| **Login (Crear Token)**   | `POST`      | `/api/auth/jwt/create/`      | No                      | `{ "email", "password" }`                                 | `200 OK` - `{ "access", "refresh" }` (tokens JWT)                     |
| **Refrescar Token**       | `POST`      | `/api/auth/jwt/refresh/`     | No                      | `{ "refresh": "token_value" }`                            | `200 OK` - `{ "access": "new_token" }`                                |
| **Verificar Token**       | `POST`      | `/api/auth/jwt/verify/`      | No                      | `{ "token": "token_value" }`                              | `200 OK` (sin cuerpo)                                                 |
| **Obtener Perfil Propio** | `GET`       | `/api/auth/users/me/`        | Sí (Access Token)       | N/A                                                       | `200 OK` - `{ "id", "email", "first_name", "last_name", "role" }`     |
| **Actualizar Perfil**     | `PUT/PATCH` | `/api/auth/users/me/`        | Sí (Access Token)       | `{ "first_name", "last_name" }` (u otros campos)          | `200 OK` - `{ "id", "email", "first_name", "last_name", "role" }`     |
| **Solicitar Reseteo Pwd** | `POST`      | `/api/auth/users/reset_password/` | No                 | `{ "email": "user@example.com" }`                       | `204 No Content`                                                      |
| **Confirmar Reseteo Pwd** | `POST`      | `/api/auth/users/reset_password_confirm/` | No       | `{ "uid", "token", "new_password" }`                    | `204 No Content`                                                      |
| **Listar Usuarios**       | `GET`       | `/api/users/`                | Sí (Admin)              | N/A                                                       | `200 OK` - `[ {user_object}, ... ]`                                  |
| **Gestionar Usuario**     | `GET/PUT/DELETE` | `/api/users/{id}/`      | Sí (Admin)              | N/A para GET/DELETE, `{user_data}` para PUT               | `200 OK`, `204 No Content`                                            |


## 5. Flujos de Usuario

### 5.1. Registro y Primer Login
1.  Un nuevo usuario visita la aplicación y accede a la página de registro.
2.  Envía su `email`, `password`, `first_name` y `last_name` a través del endpoint `POST /api/auth/users/`.
3.  El sistema crea una nueva cuenta de usuario con el rol `MEMBER` por defecto y devuelve un `201 Created`.
4.  El usuario es redirigido a la página de login.
5.  Introduce su `email` y `password` en el endpoint `POST /api/auth/jwt/create/`.
6.  El sistema valida las credenciales y devuelve un token de `access` y uno de `refresh`.
7.  El frontend almacena estos tokens de forma segura (el `access` token en memoria, el `refresh` token en una cookie HttpOnly).
8.  El usuario es redirigido al dashboard principal de la aplicación.

### 5.2. Petición Autenticada
1.  Para acceder a un recurso protegido (ej. `GET /api/tasks/`), el frontend incluye el `access` token en la cabecera `Authorization: Bearer <token>`.
2.  El backend valida el token. Si es válido, procesa la petición y devuelve los datos.
3.  Si el `access` token ha expirado, el backend devuelve un `401 Unauthorized`.
4.  El frontend intercepta el `401`, usa el `refresh` token para solicitar un nuevo `access` token al endpoint `/api/auth/jwt/refresh/`.
5.  Con el nuevo token, el frontend reintenta la petición original.

---
Fin del Documento 