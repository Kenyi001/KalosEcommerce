# Ticket: Inicializar Backend (Django)

- **ID del Ticket:** `fase0-0003`
- **Fase:** Fase 0: Configuración del Proyecto y Cimientos
- **Estado:** Abierto
- **Prioridad:** Alta

---

## Descripción

Crear la estructura inicial del proyecto de Django, incluyendo la configuración básica, la creación de la primera app `core`, y la conexión con la base de datos PostgreSQL que se ejecuta en Docker.

---

## Criterios de Aceptación

- [ ] Se ha creado un proyecto de Django dentro de un directorio `backend`.
- [ ] Se ha creado una app de Django llamada `core`.
- [ ] La configuración de Django (`settings.py`) está preparada para usar variables de entorno para los valores sensibles (ej. `SECRET_KEY`, credenciales de la BD).
- [ ] El proyecto se conecta exitosamente a la base de datos PostgreSQL del servicio de Docker.
- [ ] Se pueden ejecutar las migraciones iniciales de Django (`manage.py migrate`).

---

## Dependencias

- **Bloqueado por:** `fase0-0002-docker-setup.md` 