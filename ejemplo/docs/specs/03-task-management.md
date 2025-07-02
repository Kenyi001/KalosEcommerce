# Especificación del Sistema: Gestión de Tareas

- **ID:** `SPEC-003`
- **Componente:** `Task Management`
- **Estado:** `Borrador`
- **Depende de:** `SPEC-001`, `SPEC-002`

---

## 1. Resumen

Este documento detalla el sistema para la gestión de tareas, que es la unidad de trabajo fundamental en la aplicación. Define el ciclo de vida de una tarea, sus atributos, y cómo los usuarios interactúan con ella dentro de un proyecto.

## 2. Modelo de Datos

### Tabla: `tasks_task`

| Nombre de Columna | Tipo de Dato         | Restricciones / Notas                                       |
| ----------------- | -------------------- | ----------------------------------------------------------- |
| `id`              | UUID                 | Llave primaria, autogenerada.                               |
| `project`         | ForeignKey(`Project`)| **Requerido**. El proyecto al que pertenece la tarea.         |
| `title`           | VARCHAR(255)         | **Requerido**. Título conciso de la tarea.                  |
| `description`     | TEXT                 | Opcional. Descripción detallada de la tarea.              |
| `status`          | VARCHAR(50)          | **Requerido**. Opciones: `PENDING`, `IN_PROGRESS`, `COMPLETED`. Default: `PENDING`. |
| `priority`        | VARCHAR(50)          | **Requerido**. Opciones: `LOW`, `MEDIUM`, `HIGH`. Default: `MEDIUM`. |
| `assignee`        | ForeignKey(`User`)   | Opcional. Usuario asignado para completar la tarea. Debe ser miembro del proyecto. |
| `reporter`        | ForeignKey(`User`)   | **Requerido**. El usuario que creó la tarea.                |
| `due_date`        | DATE                 | Opcional. Fecha de vencimiento para la tarea.             |
| `created_at`      | DATETIME             | Fecha de creación, autogestionada.                          |
| `updated_at`      | DATETIME             | Fecha de última actualización, autogestionada.              |

## 3. Roles y Permisos a Nivel de Tarea

Los permisos se basan en la membresía del proyecto (`SPEC-002`).

| Acción                 | ¿Quién puede realizarla?                                       |
| ---------------------- | -------------------------------------------------------------- |
| **Crear Tarea**        | Cualquier miembro (`Member` o `Owner`) del proyecto.          |
| **Leer Tareas**        | Cualquier miembro del proyecto.                                |
| **Actualizar Tarea**   | Cualquier miembro del proyecto.                                |
| **Eliminar Tarea**     | El `reporter` de la tarea o el `Owner` del proyecto.           |
| **Asignar Tarea**      | Cualquier miembro del proyecto puede asignar la tarea a otro miembro del mismo proyecto. |

## 4. API Endpoints

Las rutas de la API para tareas estarán anidadas bajo los proyectos para reflejar la estructura de los datos.

| Funcionalidad             | Método HTTP | Ruta de API                               | Autenticación / Permisos Requeridos    | Payload de Petición (JSON)                                | Respuesta Exitosa (2xx)                                 |
| ------------------------- | ----------- | ----------------------------------------- | -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Crear Tarea**           | `POST`      | `/api/projects/{project_id}/tasks/`       | Sí (Miembro del proyecto)              | `{ "title", "description"?, "assignee_id"?, "due_date"? }` | `201 Created` - `{ task_object }`                       |
| **Listar Tareas de Proy.**| `GET`       | `/api/projects/{project_id}/tasks/`       | Sí (Miembro del proyecto)              | N/A (con filtros opcionales por `status`, `assignee`, etc.) | `200 OK` - `[ { task_object }, ... ]`                     |
| **Obtener Detalles Tarea**| `GET`       | `/api/projects/{project_id}/tasks/{id}/`  | Sí (Miembro del proyecto)              | N/A                                                       | `200 OK` - `{ task_object_with_details }`               |
| **Actualizar Tarea**      | `PUT/PATCH` | `/api/projects/{project_id}/tasks/{id}/`  | Sí (Miembro del proyecto)              | `{ "title"?, "description"?, "status"?, "priority"?, "assignee_id"?, "due_date"? }` | `200 OK` - `{ task_object }`                         |
| **Eliminar Tarea**        | `DELETE`    | `/api/projects/{project_id}/tasks/{id}/`  | Sí (Reporter de la tarea o Owner del proy.) | N/A                                                       | `204 No Content`                                        |

## 5. Flujos de Usuario

### 5.1. Creación de una Tarea
1.  Un miembro del proyecto, viendo el tablero o la lista de tareas, hace clic en "Crear Tarea".
2.  El frontend envía una petición `POST /api/projects/{project_id}/tasks/` con al menos el `title`. Puede incluir opcionalmente una descripción, un responsable (`assignee_id`), etc. El `reporter` se establece automáticamente en el backend como el usuario que realiza la petición.
3.  El sistema valida que el usuario es miembro del proyecto.
4.  Si se proporciona un `assignee_id`, el sistema valida que ese usuario también es miembro del proyecto.
5.  Se crea la tarea con estado `PENDING` y se devuelve el objeto de la tarea.

### 5.2. Actualización del Estado de una Tarea
1.  Un miembro del proyecto (normalmente el `assignee`) arrastra la tarea de una columna (ej. "Pendiente") a otra (ej. "En Progreso") en un tablero Kanban, o la actualiza desde un formulario.
2.  El frontend envía una petición `PATCH /api/projects/{project_id}/tasks/{id}/` con el payload `{ "status": "IN_PROGRESS" }`.
3.  El backend actualiza el estado de la tarea y devuelve el objeto actualizado.
4.  (Opcional) El sistema podría generar notificaciones para los usuarios relevantes (reporter, assignee).

---
Fin del Documento 