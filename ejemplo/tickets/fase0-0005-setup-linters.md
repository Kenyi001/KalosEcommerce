# Ticket: Configurar Linters y Formateadores

- **ID del Ticket:** `fase0-0005`
- **Fase:** Fase 0: Configuración del Proyecto y Cimientos
- **Estado:** Abierto
- **Prioridad:** Media

---

## Descripción

Configurar herramientas de linting y formateo de código para los proyectos de backend y frontend. Esto es crucial para mantener un estilo de código consistente y limpio, y para detectar errores potenciales de forma temprana.

---

## Criterios de Aceptación

- [ ] El backend de Django está configurado para usar `Black` como formateador y `Flake8` como linter.
- [ ] El frontend de React está configurado para usar `Prettier` como formateador y `ESLint` como linter.
- [ ] Se han añadido scripts en los `package.json` y/o `Makefile` para ejecutar fácilmente las herramientas (ej. `npm run lint`, `make format`).
- [ ] (Opcional) Se ha configurado un hook de pre-commit (ej. con `Husky` o `pre-commit`) para ejecutar estas herramientas antes de cada commit.

---

## Dependencias

- **Bloqueado por:** `fase0-0003-init-django-backend.md`, `fase0-0004-init-react-frontend.md` 