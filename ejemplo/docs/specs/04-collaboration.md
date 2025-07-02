# Especificación del Sistema: Colaboración (Comentarios y Adjuntos)

- **ID:** `SPEC-004`
- **Componente:** `Collaboration Features`
- **Estado:** `Borrador`
- **Depende de:** `SPEC-003`

---

## 1. Resumen

Este documento describe las funcionalidades que permiten la colaboración dentro de una tarea: la capacidad de dejar comentarios y de adjuntar archivos. Estos sistemas enriquecen la comunicación y centralizan la información relevante para cada tarea.

## 2. Modelo de Datos

### Tabla: `tasks_comment`

| Nombre de Columna | Tipo de Dato       | Restricciones / Notas                                     |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `id`              | UUID               | Llave primaria, autogenerada.                             |
| `task`            | ForeignKey(`Task`) | **Requerido**. La tarea a la que pertenece el comentario. |
| `author`          | ForeignKey(`User`) | **Requerido**. El usuario que escribió el comentario.    |
| `body`            | TEXT               | **Requerido**. El contenido del comentario.               |
| `created_at`      | DATETIME           | Fecha de creación, autogestionada.                        |
| `updated_at`      | DATETIME           | Fecha de última actualización, autogestionada.            |

### Tabla: `tasks_attachment`

| Nombre de Columna | Tipo de Dato       | Restricciones / Notas                                     |
| ----------------- | ------------------ | --------------------------------------------------------- |
| `id`              | UUID               | Llave primaria, autogenerada.                             |
| `task`            | ForeignKey(`Task`) | **Requerido**. La tarea a la que pertenece el adjunto.   |
| `owner`           | ForeignKey(`User`) | **Requerido**. El usuario que subió el archivo.         |
| `file`            | FileField          | **Requerido**. Referencia al archivo almacenado (ej. en S3). |
| `filename`        | VARCHAR(255)       | Nombre del archivo.                                       |
| `created_at`      | DATETIME           | Fecha de subida, autogestionada.                          |

*Nota sobre Almacenamiento:* Los archivos no se guardarán en la base de datos, sino en un servicio de almacenamiento de objetos como AWS S3, Google Cloud Storage, o en el sistema de archivos local para desarrollo. El campo `file` solo contendrá la ruta o URL al archivo.

## 3. Permisos

| Acción                   | ¿Quién puede realizarla?                                       |
| ------------------------ | -------------------------------------------------------------- |
| **Crear Comentario**     | Cualquier miembro del proyecto al que pertenece la tarea.      |
| **Leer Comentarios**     | Cualquier miembro del proyecto al que pertenece la tarea.      |
| **Actualizar Comentario**| Solo el `author` del comentario.                               |
| **Eliminar Comentario**  | El `author` del comentario o el `Owner` del proyecto.          |
| **Subir Adjunto**        | Cualquier miembro del proyecto al que pertenece la tarea.      |
| **Leer/Descargar Adjunto** | Cualquier miembro del proyecto al que pertenece la tarea.      |
| **Eliminar Adjunto**     | El `owner` del adjunto o el `Owner` del proyecto.              |

## 4. API Endpoints

Las rutas estarán anidadas bajo las tareas.

### Comentarios

| Funcionalidad             | Método HTTP | Ruta de API                                       | Permisos Requeridos       | Payload de Petición (JSON) | Respuesta Exitosa (2xx)                 |
| ------------------------- | ----------- | ------------------------------------------------- | ------------------------- | -------------------------- | --------------------------------------- |
| **Añadir Comentario**     | `POST`      | `/api/projects/{proj_id}/tasks/{task_id}/comments/` | Sí (Miembro del proyecto) | `{ "body": "texto" }`      | `201 Created` - `{ comment_object }`    |
| **Listar Comentarios**    | `GET`       | `/api/projects/{proj_id}/tasks/{task_id}/comments/` | Sí (Miembro del proyecto) | N/A                        | `200 OK` - `[ { comment_object } ]`     |
| **Actualizar Comentario** | `PUT/PATCH` | `/api/comments/{id}/`                             | Sí (Autor del comentario) | `{ "body": "nuevo texto" }`| `200 OK` - `{ comment_object }`         |
| **Eliminar Comentario**   | `DELETE`    | `/api/comments/{id}/`                             | Sí (Autor o Proy. Owner)  | N/A                        | `204 No Content`                        |

### Archivos Adjuntos

| Funcionalidad          | Método HTTP | Ruta de API                                           | Permisos Requeridos       | Payload de Petición (form-data) | Respuesta Exitosa (2xx)                  |
| ---------------------- | ----------- | ----------------------------------------------------- | ------------------------- | ------------------------------- | ---------------------------------------- |
| **Subir Adjunto**      | `POST`      | `/api/projects/{proj_id}/tasks/{task_id}/attachments/` | Sí (Miembro del proyecto) | `file` (el archivo binario)     | `201 Created` - `{ attachment_object }`  |
| **Listar Adjuntos**    | `GET`       | `/api/projects/{proj_id}/tasks/{task_id}/attachments/` | Sí (Miembro del proyecto) | N/A                             | `200 OK` - `[ { attachment_object } ]`   |
| **Eliminar Adjunto**   | `DELETE`    | `/api/attachments/{id}/`                              | Sí (Owner o Proy. Owner)  | N/A                             | `204 No Content`                         |

---
Fin del Documento 