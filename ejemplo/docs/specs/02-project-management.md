# Especificación del Sistema: Gestión de Proyectos

- **ID:** `SPEC-002`
- **Componente:** `Project Management`
- **Estado:** `Borrador`
- **Depende de:** `SPEC-001` (Autenticación y Gestión de Usuarios)

---

## 1. Resumen

Este documento define la arquitectura para la gestión de Proyectos (o Tableros). Los proyectos son el contenedor principal para las tareas y el espacio de colaboración para los usuarios. El sistema permitirá a los usuarios crear proyectos, gestionarlos y añadir a otros usuarios como miembros para colaborar.

## 2. Modelo de Datos

### Tabla: `projects_project`

| Nombre de Columna | Tipo de Dato         | Restricciones / Notas                                       |
| ----------------- | -------------------- | ----------------------------------------------------------- |
| `id`              | UUID                 | Llave primaria, autogenerada.                               |
| `name`            | VARCHAR(255)         | **Requerido**. Nombre del proyecto.                         |
| `description`     | TEXT                 | Opcional. Descripción detallada del proyecto.             |
| `owner`           | ForeignKey(`User`)   | **Requerido**. El creador del proyecto. Si el owner se elimina, el proyecto también. |
| `created_at`      | DATETIME             | Fecha de creación, autogestionada.                          |
| `updated_at`      | DATETIME             | Fecha de última actualización, autogestionada.              |

### Tabla: `projects_project_members` (Tabla intermedia Many-to-Many)

Esta tabla asocia usuarios a los proyectos.

| Nombre de Columna | Tipo de Dato         | Restricciones / Notas                     |
| ----------------- | -------------------- | ----------------------------------------- |
| `id`              | AUTOINCREMENT        | Llave primaria.                           |
| `project_id`      | ForeignKey(`Project`)| Enlace al proyecto.                       |
| `user_id`         | ForeignKey(`User`)   | Enlace al usuario miembro.                |
| `date_joined`     | DATETIME             | Fecha en que el usuario se unió al proyecto. |

## 3. Roles y Permisos a Nivel de Proyecto

| Rol         | Descripción                                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Owner**   | El creador del proyecto. Tiene permisos CRUD completos sobre el proyecto (editar nombre/descripción, eliminar proyecto) y puede gestionar sus miembros (añadir/eliminar). |
| **Member**  | Un usuario que ha sido añadido al proyecto. Puede ver los detalles del proyecto y gestionar tareas dentro de él (los permisos específicos de tareas se definirán en `SPEC-003`). Puede abandonar el proyecto. |

## 4. API Endpoints

| Funcionalidad                 | Método HTTP | Ruta de API                               | Autenticación / Permisos Requeridos                    | Payload de Petición (JSON)                       | Respuesta Exitosa (2xx)                                 |
| ----------------------------- | ----------- | ----------------------------------------- | ------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------- |
| **Crear Proyecto**            | `POST`      | `/api/projects/`                          | Sí (Cualquier usuario logueado)                        | `{ "name", "description"? }`                     | `201 Created` - `{ project_object }`                    |
| **Listar mis Proyectos**      | `GET`       | `/api/projects/`                          | Sí (Cualquier usuario logueado)                        | N/A                                              | `200 OK` - `[ { project_object }, ... ]`                |
| **Obtener Detalles Proyecto** | `GET`       | `/api/projects/{id}/`                     | Sí (Miembro del proyecto)                              | N/A                                              | `200 OK` - `{ project_object_with_members }`            |
| **Actualizar Proyecto**       | `PUT/PATCH` | `/api/projects/{id}/`                     | Sí (Owner del proyecto)                                | `{ "name"?, "description"? }`                     | `200 OK` - `{ project_object }`                         |
| **Eliminar Proyecto**         | `DELETE`    | `/api/projects/{id}/`                     | Sí (Owner del proyecto)                                | N/A                                              | `204 No Content`                                        |
| **Añadir Miembro**            | `POST`      | `/api/projects/{id}/members/`             | Sí (Owner del proyecto)                                | `{ "email": "user@example.com" }`                | `201 Created` - `{ "message": "User added" }`         |
| **Eliminar Miembro**          | `DELETE`    | `/api/projects/{id}/members/{user_id}/`   | Sí (Owner del proyecto, o el propio usuario a eliminar) | N/A                                              | `204 No Content`                                        |

## 5. Flujos de Usuario

### 5.1. Creación de un Proyecto
1.  Un usuario logueado envía una petición `POST /api/projects/` con el nombre y, opcionalmente, una descripción.
2.  El sistema crea una nueva instancia de `Project`, asignando al usuario peticionario como `owner`.
3.  El sistema crea una entrada en la tabla `projects_project_members` que asocia al `owner` como el primer miembro del proyecto.
4.  Se devuelve el objeto del proyecto recién creado.

### 5.2. Añadir un Miembro a un Proyecto
1.  El `owner` del proyecto, desde la interfaz de gestión de miembros, introduce el email de otro usuario registrado.
2.  El frontend envía una petición `POST /api/projects/{id}/members/` con el email del usuario a añadir.
3.  El backend busca al usuario por su email. Si existe y no es ya miembro, lo añade a la tabla `projects_project_members` para ese proyecto.
4.  Se devuelve un mensaje de éxito. (Opcional: se podría enviar una notificación al usuario añadido).

### 5.3. Abandonar un Proyecto
1.  Un `member` de un proyecto decide abandonarlo.
2.  El frontend envía una petición `DELETE /api/projects/{id}/members/{user_id}/` donde `{user_id}` es el ID del propio usuario.
3.  El backend verifica que el usuario que realiza la petición es el mismo que se quiere eliminar (o es el owner), y elimina la entrada correspondiente en la tabla `projects_project_members`.
4.  Se devuelve una respuesta `204 No Content`.

---
Fin del Documento 