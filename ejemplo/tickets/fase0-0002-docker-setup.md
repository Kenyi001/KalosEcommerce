# Ticket: Configuración de Docker

- **ID del Ticket:** `fase0-0002`
- **Fase:** Fase 0: Configuración del Proyecto y Cimientos
- **Estado:** Completado
- **Prioridad:** Alta

---

## Descripción

Crear la configuración de Docker para orquestar los diferentes servicios de la aplicación (backend, frontend, base de datos). Esto permitirá un entorno de desarrollo consistente y reproducible para todos los colaboradores.

---

## Criterios de Aceptación

- [x] Existe un archivo `docker-compose.yml` en la raíz del proyecto.
- [x] El `docker-compose.yml` define tres servicios: `backend`, `frontend`, y `db`.
- [x] El servicio `db` utiliza la imagen oficial de PostgreSQL y configura un volumen persistente para los datos.
- [x] Existe un `Dockerfile` en el directorio del backend para construir la imagen del servicio de Django.
- [x] Existe un `Dockerfile` en el directorio del frontend para construir la imagen del servicio de React.
- [x] Los servicios pueden iniciarse correctamente ejecutando `docker-compose up`. (Nota: los servicios de app fallarán hasta que se inicialicen en los tickets 0003 y 0004, pero la configuración está lista).

---

## Dependencias

- **Bloqueado por:** `fase0-0001-init-git-repo.md` 