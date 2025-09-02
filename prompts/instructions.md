# Instrucciones de Documentación


## Persona y Objetivo

Eres Linus Torvalds y John Carmack, ingenieros de software legendarios encargados de discutir y acordar la hoja de ruta de implementación para mi proyecto y documentarla.


## Proyecto
# Project Chapter — Kalos E-commerce (Greenfield / Desde cero)

Versión: 1.3
Fecha: 2025-08-22
Estado: Preparado para inicio desde cero

Resumen ejecutivo
- Enfoque: Greenfield — crear el proyecto desde cero con un Design System y librería de componentes reutilizables.
- Objetivo: Entregar un MVP funcional de marketplace de servicios de belleza (clientes <-> profesionales) optimizado para móviles y desplegado en Firebase (Plan Spark) al final del ciclo.
- Prioridades: mobile-first, rendimiento, mantenibilidad y seguridad mínima adecuada para producción temprana.

Índice
- 1. Visión y objetivos
- 2. Alcance (entregables)
- 3. Arquitectura técnica
- 4. Estructura de proyecto propuesta
- 5. Design System y tokens
  - 5.1 Colores y roles
  - 5.2 Tipografía
- 6. Modelo de datos y flujos (Firestore)
  - 6.1 Carrito (Cart)
  - 6.2 Bookings y confirmaciones
- 7. Reglas Firestore y Storage (resumen)
- 8. Autenticación y control de acceso
- 9. Flujos críticos y UX (mobile-first)
- 10. Uso del Firebase Emulator en desarrollo
- 11. Seguridad y gestión de secretos
- 12. QA, pruebas y accesibilidad
- 13. CI/CD y despliegue (Firebase Hosting)
- 14. Milestones y estimación
- 15. Reglas de aceptación por página / componente
- 16. Documentación, scaffold y gobernanza
- 17. Próximos pasos y confirmaciones
- Anexos: comandos útiles, tokens de ejemplo, snippets

1. Visión y objetivos
- Visión: marketplace simple, seguro y accesible para conectar clientes y profesionales de servicios de belleza a domicilio.
- Roles principales:
  - Cliente: buscar, filtrar, ver profesionales, reservar servicios y gestionar reservas.
  - Profesional: registrarse, publicar servicios, administrar su perfil, galería y calendario/disponibilidad.
- Objetivos del MVP:
  - Autenticación: Email/password y Google Sign-In (Firebase Auth).
  - Deploy del frontend en Firebase Hosting y uso de Firestore + Storage para datos y assets.

2. Alcance (entregables de la iteración inicial)
- Entregables mínimos:
  - `docs/Project_chapter.md` (este archivo) y `docs/DESIGN_GUIDE.md` con tokens.
  - Scaffold frontend con Vite + Tailwind (configuración lista, scripts en package.json).
  - Librería básica de componentes: Button, Input, Card, Header, Footer, Modal, Avatar, Form primitives.
  - Páginas prioritarias: Landing y Auth (login/register). Opcional: Listing básico.
  - Integración con Firebase Emulator Suite para desarrollo local.
  - Despliegue inicial en Firebase Hosting (canal de preview / staging) y pipeline simple.

3. Arquitectura técnica
- Frontend: HTML5 + ES Modules + Vite + Tailwind CSS + vanilla JS modular (o small utilities). Preparar migración futura a framework si se decide.
- Backend: Firebase (Auth, Firestore, Storage). Plan Spark recomendado para minimizar costos.
- Infra y DevTools:
  - Firebase Emulator Suite (Auth, Firestore, Storage) en local.
  - GitHub Actions (o similar) para CI que haga build y despliegue a canales de Hosting.

4. Estructura de proyecto propuesta
- Raíz mínima:
  - /index.html (entry)
  - /src/
    - /components/ (componentes reutilizables)
    - /pages/ (landing, auth, listing, profile, dashboard)
    - /config/ (firebase-config.js env loader)
    - /utils/ (helpers)
  - /css/tailwind.css
  - tailwind.config.js, postcss.config.js

  4.1 Páginas y rutas (MVP / Post‑MVP)

  Esta sección documenta las rutas propuestas para la aplicación, su prioridad (MVP o Post‑MVP) y las reglas de acceso rápidas (público / requiere login / rol profesional / admin).

  Público (sin login)
  - `/` — Landing (MVP)
  - `/buscar` — Explorador de profesionales (MVP)
  - `/pro/:handle` — Perfil público del profesional + acción "Solicitar reserva" (MVP)
    - Nota: la vista del perfil es pública cuando `published == true`; la acción de "Solicitar reserva" debe exigir login antes de completar el flujo.
  - `/c/:slug` — Listado por categoría (Post‑MVP)
  - `/legal/terminos` (MVP)
  - `/legal/privacidad` (MVP)
  - `/legal/cancelaciones` (MVP)
  - `/ayuda` (Post‑MVP)
  - `/como-funciona` (Post‑MVP)
  - `/contacto` (Post‑MVP)

  Autenticación & Onboarding
  - `/auth/login` (MVP)
  - `/auth/signup?role=customer|pro` (MVP)
  - `/auth/verify` (MVP)
  - `/auth/reset` (MVP)
  - `/pro/onboarding` — wizard inicial del profesional (MVP)

  Área Cliente (requiere login)
  - `/reservar` — Solicitud de reserva (reemplaza /checkout) (MVP)
    - Flujo: Servicio → Fecha/Hora → Dirección → Resumen "Total solicitado" → Envío
  - `/cuenta` — Dashboard (MVP)
  - `/cuenta/reservas` — Mis reservas (MVP)
  - `/cuenta/reservas/:id` — Detalle (MVP)
  - `/cuenta/perfil` — Datos personales y direcciones (MVP)
  - `/cuenta/favoritos` (Post‑MVP)
  - `/cuenta/notificaciones` (Post‑MVP)
  - `/cuenta/soporte` (Post‑MVP)

  Área Profesional (requiere login + rol=professional)
  - `/pro/dashboard` (MVP)
  - `/pro/reservas` — Bandeja (pendientes/confirmadas/etc.) (MVP)
  - `/pro/reservas/:id` — Detalle con Aceptar / Rechazar (MVP)
  - `/pro/agenda` — Disponibilidad y bloqueos (MVP)
  - `/pro/editar` — Edición del perfil (Identidad, Categorías, Catálogo ⇄ “SERVICIO”, Portafolio, Cobertura, Políticas) (MVP)
  - `/pro/configuracion` — Cuenta y seguridad (MVP)
  - `/pro/finanzas` (Post‑MVP)
  - `/pro/estadisticas` (Post‑MVP)
  - `/pro/ayuda` (Post‑MVP)

  Admin (opcional, Post‑MVP)
  - `/admin` (Post‑MVP)
  - `/admin/usuarios` (Post‑MVP)
  - `/admin/profesionales` — revisión/KYC (Post‑MVP)
  - `/admin/reservas` (Post‑MVP)
  - `/admin/catalogo` — categorías globales (Post‑MVP)
  - `/admin/reportes` (Post‑MVP)
  - `/admin/notificaciones` (Post‑MVP)
  - `/admin/config` (Post‑MVP)

  Sistema / Utilitarias
  - `/404` (MVP)
  - `/500` (MVP)
  - `/mantenimiento` (Post‑MVP)

  Prioridad (MVP obligatorio)
  - Rutas mínimas que deben estar completadas en la primera entrega (MVP):
    - `/`, `/buscar`, `/pro/:handle`, `/auth/*` (login/signup/verify/reset), `/reservar`, `/cuenta/reservas` (+ detalle), `/cuenta/perfil`, `/pro/dashboard`, `/pro/reservas` (+ detalle), `/pro/agenda`, `/pro/editar`, `/pro/configuracion`, `/legal/*`, `/404`, `/500`.

  Notas de implementación rápidas
  - Mapear cada ruta a un componente en `/src/pages` y un layout compartido (`PublicLayout`, `AuthLayout`, `DashboardLayout`, `ProLayout`, `AdminLayout`).
  - Control de acceso: usar guards en el router (o middleware simple) que verifiquen `auth` y `role` antes de permitir renderizar rutas protegidas. Para acciones críticas (crear booking, aceptar booking), forzar validación en servidor/rules.
  - SEO y rutas públicas: perfiles públicos (`/pro/:handle`) deben exponer metatags, Open Graph y contenido suficiente para enlaces compartidos.
  - Versionado de rutas: documentar cualquier cambio de ruta en `docs/ROUTES.md` y mantener compatibilidad simple (redirects en `firebase.json` si se renombra rutas).


5. Design System y tokens
- Definir tokens primero: colores primarios/secundarios, escala tipográfica, espaciados, radios y sombras.
- Mapear tokens en `tailwind.config.js` para utilidades consistentes.
- Documentar componentes en `src/components/README.md` y ejemplos de uso en `docs/COMPONENTS.md`.

5.1 Colores y roles (paleta propuesta)
- Paleta base (9 colores suministrados):
  - Brand primario: Kalos Coral — `#F74F4E`
  - Brand secundario: Deep Navy — `#303F56`
  - Acentos: Gold — `#FCBE3C`, Deep Coral — `#CA472B`, Rosy — `#D6868D`
  - Fondos cálidos: White — `#FAFAFA`, Beige — `#F3E7DB`
  - Textos fuertes: Black — `#261B15`
  - Apoyos: Brown — `#8C6E64`

- Neutros (imprescindible para UI):
  - Gray-50: `#F8FAFC`
  - Gray-100: `#F1F5F9`
  - Gray-200: `#E5E7EB`
  - Gray-400: `#9CA3AF`
  - Gray-600: `#4B5563`
  - Gray-900: `#111827`

- Semánticos:
  - Success (Green-600): `#16A34A`
  - Error (Red-600): `#DC2626`
  - Warning: Gold `#FCBE3C`
  - Info: Blue-600 `#2563EB` (o Deep Navy para estilo sobrio)

- Estados de interacción (derivados):
  - Primary (Coral):
    - base: `#F74F4E`
    - hover: `#E94445`
    - pressed: `#D13C3B`
    - subtle bg (chip/badge): `#FDEBEC`
  - Secondary (Navy):
    - base: `#303F56`
    - hover: `#2A394E`
    - pressed: `#233141`
    - subtle bg: `#E8EDF3`

- Accesibilidad / overlays:
  - Focus ring (Coral 40% alpha): `#F74F4E66`
  - Modal overlay: `#00000099`
  - Sombra base: negro 12–18% (elevación)

- Modo oscuro (guía):
  - Fondo base: `#0F1115`
  - Superficies: `#17202B`
  - Texto: White / Gray-100
  - Aclarar Coral/Gold ≈ +12% luz para contraste

- Reglas de uso (mapa rápido):
  - Header/títulos: Deep Navy o Black sobre White.
  - CTA principal: Coral (texto blanco), usar hover/pressed definidos.
  - Chips/categorías: inactivo Gray-100 + Gray-600; activo Coral subtle + borde Coral.
  - Tarjetas catálogo: superficie Gray-50/White; borde Gray-200; precio Gold; badges Gray-400 / Coral subtle.
  - Panel servicio: fondo Beige, títulos Navy, inputs con borde Gray-200 y foco Coral.
  - Mensajes del sistema: success/error/warning/info usando colores semánticos.

5.2 Tipografía — decisiones fijas y escala (mobile-first)
1) Decisiones de tipografía (fijas)
 - Títulos (H1–H2): Fraunces Variable, peso 600 (serif display).
 - Resto de la UI: Inter Variable, pesos 400/600/700.
 - Regla de uso: Fraunces solo en títulos y frases cortas (>=18 px). Nunca en inputs, párrafos largos ni etiquetas pequeñas.

2) Escala tipográfica (mobile-first → desktop)
 - Usa estas cifras como "estilos" en Figma. Líneas siempre generosas para respiración.

Móvil
 - H1 (Fraunces 600): 24 px / 1.25 — nombre del profesional.
 - H2 (Fraunces 600): 18 px / 1.35 — títulos de bloque ("Categorías", "Portafolio", "Servicio").
 - H3 (Inter 600): 16 px / 1.35 — subtítulos internos, modales.
 - Body (Inter 400): 16 px / 1.55 — texto general y descripciones.
 - Small (Inter 400): 14 px / 1.45 — ayudas, notas.
 - Micro/Label (Inter 600): 12 px / 1.35 — chips, badges, overlines (con tracking +0.04–0.06 em).
 - Botón (Inter 600): 15–16 px / 1.2.

Desktop
 - H1 (Fraunces 600): 32 px / 1.25.
 - H2 (Fraunces 600): 24 px / 1.35.
 - H3 (Inter 600): 18 px / 1.4.
 - Body (Inter 400): 16 px / 1.6.
 - Small/Micro/Botón: igual que móvil.

Espaciado vertical sugerido
 - H1 → siguiente bloque: 16–24 px
 - H2/H3 → siguiente: 12–16 px
 - Párrafo a párrafo: 8–12 px

3) Microtipografía (calidad y coherencia)
 - Números tabulares (Inter): activa tabular-nums para precios y duraciones (alinean columnas).
 - Frases en MAYÚSCULAS (chips/badges): tracking +0.04–0.08 em (mejora legibilidad).
 - Optical size (Fraunces): usa automático; evita tamaños <18 px.
 - Evita cursivas salvo acentos puntuales (pierden contraste en móvil).
 - Ancho de línea ideal en párrafos: 50–75 caracteres.

4) Mapeo por secciones de la página
 - Header (marca, Home/Reservas): Inter 600 14–16 px; si pones "KALOS" como logotipo en texto, puedes usar Fraunces 600 (solo la marca).

 - Identidad del profesional:
   - Nombre → H1 Fraunces 600.
   - Frase corta/claim → Inter 400 16 px (no Fraunces).

 - Categorías (chips): Inter 600 14 px, MAYÚSCULAS con tracking +0.06 em.

 - Catálogo (tarjetas):
   - Título → Inter 600 16 px
   - Precio → Inter 600 16 px con tabular-nums
   - Duración/estado → Inter 400 14 px
   - Badges → Inter 600 12 px (MAYÚSCULAS)

 - Panel “SERVICIO”:
   - Título de bloque ("Servicio") → H2 Fraunces 600
   - Labels de formulario → Inter 600 12–14 px
   - Texto de campos → Inter 400 16 px
   - Ayudas/errores → Inter 400 12–14 px (errores en color de “error”)

 - Portafolio:
   - Título → H2 Fraunces 600
   - Leyendas de imágenes → Inter 400 14 px
   - Overlays/acciones → Inter 600 14 px

 - Toasts/Modales:
   - Título → Inter 600 16–18 px
   - Mensaje → Inter 400 14–16 px

5) Accesibilidad y rendimiento
 - Contraste: textos con Deep Navy/Black sobre White/Beige; evita Rosy/Gold para párrafos largos.
 - Tamaño mínimo: 14 px en cualquier texto interactivo.
 - Área táctil: ≥ 44 px para botones y chips.
 - Variable fonts + “swap”: carga una sola variante por familia y evita texto invisible.
 - Fallbacks: Fraunces → Georgia/serif; Inter → System UI/sans-serif.

6) Estilos de texto (nombres sugeridos para Figma)
 - H1 / Fraunces / 32 (24 en móvil) / 600
 - H2 / Fraunces / 24 (18 en móvil) / 600
 - H3 / Inter / 18 / 600
 - Body / Inter / 16 / 400
 - Small / Inter / 14 / 400
 - Label / Inter / 12 / 600 / +0.06 em
 - Button / Inter / 16 / 600
 - Price / Inter / 16 / 600 / Tabular

7) Do / Don't (rápido)
Do
 - Usa Fraunces para dar personalidad en títulos y nombres.
 - Mantén consistencia: un solo tamaño por nivel (H1, H2, etc.).
 - Alinea precios y tiempos con números tabulares.

Don't
 - No uses Fraunces en textos pequeños, inputs o párrafos extensos.
 - No mezcles demasiados pesos/estilos en una misma tarjeta.
 - No uses colores de acento (Gold/Rosy) para texto largo.

6. Modelo de datos y flujos (Firestore)
 - Collections principales (nombres sugeridos):
  - users/{userId}
    - role: 'customer' | 'professional' | 'admin'
    - displayName, email, phone, location, avatarUrl
    - professionalProfile: { bio, services: [serviceId], gallery: [storagePath], rating }
   - services/{serviceId}
     - professionalId, title, description, price, durationMinutes, category, active, images[]
   - bookings/{bookingId}
     - customerId, serviceId, professionalId, datetime, status: 'pending'|'accepted'|'confirmed'|'cancelled'|'done'
     - paymentRequired: boolean
     - paymentStatus: 'not_required'|'pending'|'paid'
   - reviews/{reviewId}
     - bookingId, authorId, rating, text

6.1 Carrito (Cart) — modelo, reglas y flujo
 - Objetivo: permitir a usuarios (anónimos y autenticados) añadir servicios para revisar y posteriormente convertirlos en reservas; forzar autenticación en el momento de crear la reserva.

 - Modelo Firestore recomendado (subcolección por usuario)
   - users/{userId}/cart/{cartItemId}
     - serviceId: string
     - professionalId: string
     - title: string        // snapshot del título al añadir
     - priceBOB: number     // snapshot del precio al añadir (entero en BOB)
     - durationMinutes: number
     - scheduledDatetime: timestamp | null
     - quantity: number = 1
     - metadata: object (opcional)
     - createdAt: timestamp

 - Sincronización y persistencia (comportamiento UX)
   - Anónimo: carrito en localStorage/IndexedDB; CTA para iniciar sesión al intentar checkout.
   - Al iniciar sesión: merge localCart → serverCart usando write batch.
   - Autenticado: listeners en tiempo real sobre `users/{uid}/cart`.

 - Checkout → creación de booking (transaction)
   1. Cliente pulsa "Reservar" desde carrito.
   2. Si no autenticado → login obligatorio.
   3. En cliente: transaction que valide disponibilidad, cree `bookings/{id}` con status 'pending' y snapshots, y (opcional) marque slot ocupado.
   4. Si transaction falla → informar y mantener carrito.
   5. Si pasa → limpiar items relacionados del carrito.

 - Validaciones críticas: disponibilidad, bloqueo de doble-reserva, priceSnapshot.

6.2 Bookings y confirmaciones (flujo profesional)
 - Campos recomendados en `bookings/{bookingId}`:
   - status: 'pending'|'accepted'|'confirmed'|'cancelled'|'done'
   - createdAt, updatedAt
   - priceSnapshot: { amountBOB }
   - titleSnapshot
   - paymentRequired (false en MVP), paymentStatus
   - professionalConfirmation: { status, confirmedAt, note, by }
   - customerNotified: boolean

 - Flujo:
   - Cliente crea booking -> status 'pending'.
   - Profesional revisa en su dashboard -> acepta/rechaza (transactional).
   - Al aceptar: actualizar status a 'accepted', set professionalConfirmation y notificar al cliente.
   - Al rechazar: set 'rejected' con nota; cliente puede reagendar o cancelar.

 - Notificaciones: documento `notifications/{userId}/{notifId}` o Cloud Function para emails/FCM.

7. Reglas Firestore y Storage (resumen)
- Principios:
  - Solo operaciones autorizadas por role (client/professional).
  - Cart solo editable por su owner.
  - Bookings: create por clientId autenticado; update de status por professionalId.

 - Ejemplo (pseudocódigo de reglas):
```
match /users/{userId}/cart/{cartItemId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

match /bookings/{bookingId} {
  allow create: if request.auth != null && request.resource.data.customerId == request.auth.uid;
  allow read: if request.auth != null && (request.auth.uid == resource.data.customerId || request.auth.uid == resource.data.professionalId);
  allow update: if request.auth != null && (
    (request.auth.uid == resource.data.professionalId && request.resource.data.status in ['accepted','confirmed','cancelled','done'])
    || (request.auth.uid == resource.data.customerId && request.resource.data.status == 'cancelled')
  );
}
```

8. Autenticación y control de acceso
- Acceso público: ver listados, landing y páginas públicas sin autenticación.
- Acceso protegido: crear reservas, páginas de profesional (perfil, dashboard, CRUD servicios) y operaciones que afecten a otros usuarios.
- UI: bloquear acciones protegidas y mostrar CTA de login; usar emulador en desarrollo.

9. Flujos críticos y UX (mobile-first)
- Autenticación: Email/password + Google.
- Onboarding profesional: completar perfil, subir portfolio, publicar servicio.
- Búsqueda & filtro: proximidad/categoría/precio.
- Reserva: elegir servicio → seleccionar horario → crear booking (pending) → confirmación profesional.

10. Firebase: uso, entornos y despliegue

10.1 Resumen de productos usados (MVP)
- Auth: Email/Password (verificación de correo obligatoria). Opcional: Google/Apple más adelante.
- Firestore (Native mode): datos principales (users, professionals, services, bookings, notifications).
- Storage: imágenes públicas y privadas (avatar, servicios, portfolio, drafts).
- Emulators: Auth, Firestore, Storage para desarrollo local.
- Hosting: despliegue del frontend (Vite build) a Firebase Hosting.
- Functions: opcional (Fase 2) para notificaciones, validadores y syncing.

10.2 Proyectos y aliases CLI
- Recomendado crear dos proyectos en Firebase Console: `kalos-dev` y `kalos-prod`.
- Configurar aliases en la CLI:
  - `firebase use --add` y asignar `dev` → `kalos-dev`, `prod` → `kalos-prod`.

10.3 Archivos de configuración en el repo
- Incluir en el repositorio (root): `firebase.json` (hosting + emulators), `firestore.rules`, `storage.rules` y `.env.example` con placeholders para las variables de cliente.
- Mantener reglas como fuente de verdad en `firestore.rules` y `storage.rules` para poder ejecutarlas en el emulador y revisarlas en PRs.

10.4 Setup inicial (local)
1. Instalar Firebase CLI y herramientas (si no están):
   - `npm install -g firebase-tools`
2. Login y seleccionar proyecto alias (opcional):
   - `firebase login`
   - `firebase use dev`
3. Iniciar emulador (Auth, Firestore, Storage):
   - `firebase emulators:start --only auth,firestore,storage`
4. Para probar reglas y seeds, utilice la UI del emulador o scripts de importación (ver `docs/seeds/`).

10.5 Emulador: mejores prácticas y seeds
- Siempre desarrollar y testear reglas en el emulador aun si existen credenciales reales.
- Mantener `docs/seeds/*.json` con datos de prueba (admin, customers, professionals, services, bookings). Proveer scripts de importación o instrucciones para subirlos desde la UI del emulador.
- Recomendación de flujo para sincronizar local:
  - levantar emulador
  - `npm run seed:emulator` (si se crea script) o `firebase emulators:export ./tmp/emulator-export` luego `firebase emulators:start --import=./tmp/emulator-export`

10.6 Reglas Firestore y Storage (visión operativa)
- Firestore: guardar reglas en `firestore.rules` y probar en emulador.
- Principios que deben cubrir las reglas (tal como se documenta en la sección de reglas funcionales):
  - Admins: acceso completo.
  - Professionals: solo su subárbol `/professionals/{uid}/**` y sus bookings (proId == uid) para actualizar estado.
  - Customers: crear bookings y leer sus bookings (customerId == uid).
  - Público: leer profiles/services/portfolio cuando `published == true` y `active == true`.
  - Validaciones: `priceBOB >= 1`, `durationMin >= 15`, fechas en el futuro en bookings, etc.
- Storage: reglas que permitan lectura pública solo en `/public/...` y escritura solo por el owner (`request.auth.uid == uid`) o admin; limitar tamaños y tipos (JPG/PNG/WEBP/MP4) y tamaños (imágenes ≤ 5 MB, videos ≤ 20 MB).

10.7 Índices y performance
- Crear índices compuestos que el UI necesitará (ejemplos):
  - `bookings`: compound index por `proId` + `date` (asc)
  - `bookings`: `customerId` + `date` (desc)
  - `services`: `categoryId` + `active` + `order`
  - `portfolio`: `visibility` + `order`

10.8 Seeds y convenciones de datos
- Guardar seeds en `docs/seeds/` y documentar cómo importarlas en el emulador.
- Convenciones de IDs legibles: `svc_XXXX`, `cat_XXXX`, `bk_XXXX` ayudan en debugging.

10.9 Hosting y despliegue (manual y preview channels)
- Flujo manual:
  - `npm run build` (genera `dist/` vía Vite)
  - `firebase deploy --only hosting` (asegúrate de `firebase use prod` para prod)
- Deploys de preview (PRs): usar `firebase hosting:channel:deploy <branch>` para publicar una URL temporal que sirva la build del branch.

10.10 CI/CD (resumen práctico)
- Recomiendo GitHub Actions con estos pasos por pipeline:
  - Checkout → install → build → run tests/lint → deploy preview (on PR) → deploy prod (on `main` / manual approval).
- Guardar secretos (FIREBASE_TOKEN para deploy) en GitHub Secrets; usar `firebase-tools` y `firebase hosting:channel:deploy` en el job de PR.

10.11 Backups, monitoreo y seguridad operativa
- Habilitar backups automáticos de Firestore (daily) en prod.
- Configurar alertas de uso/quotas en Firebase Console.
- No commitear service accounts ni keys; si se encuentran, rotar y purgar historial.

10.12 Checklist rápido para dev antes de merge/deploy
- `.env.example` actualizado y variables documentadas.
- `firebase.json`, `firestore.rules` y `storage.rules` en repo.
- Seeds listos en `docs/seeds/` y script/manual para import.
- Reglas probadas en emulador (tests básicos: crear booking, aceptar booking, editar servicios).
- Índices compuestos declarados (o doc con pasos para crearlos en Console).

11. Seguridad y gestión de secretos
- No almacenar claves sensibles en el repo. Usar `.env` y secrets en CI.
- Si encuentras una service account o private key en el repo: revocar la key en Google Cloud, purgar historial (BFG/git filter-repo) y forzar push.

12. QA, pruebas y accesibilidad
- Tests mínimos: E2E manual de flujos (auth, publicar servicio, reservar, confirmar).
- Lighthouse móvil: optimizaciones (lazy images, CSS purgado) y contraste AA.
- Accesibilidad: labels en inputs, focus-visible, targets táctiles >=44 px.

13. CI/CD y despliegue (Firebase Hosting)
- Pipeline propuesto:
  - On PR/branch: build → deploy a preview channel (`firebase hosting:channel:deploy <branch>`).
  - On push a `main`: build → deploy a production hosting (aprobación manual recomendable).

Comandos útiles (PowerShell):
```powershell
# instalar dependencias dev
npm install -D tailwindcss postcss autoprefixer vite @tailwindcss/forms @tailwindcss/typography

# inicializar tailwind (si aplica)
npx tailwindcss init -p

# dev server (Vite)
npm run dev

# emulador Firebase
firebase emulators:start --only auth,firestore,storage

# build y deploy a hosting (requiere firebase-tools y login)
npm run build
firebase deploy --only hosting

# deploy preview
firebase hosting:channel:deploy staging-<branch>
```

14. Milestones y estimación (iterativa)
- Sprint 0 (1 día): Setup repo, Tailwind/Vite, configs, estructura de carpetas.
- Sprint 1 (3-4 días): Design System básico y componentes; Landing + Auth.
- Sprint 2 (4-6 días): Listados, perfil profesional, CRUD servicios y galería.
- Sprint 3 (3-4 días): Reserva básica, integración con Firestore, reglas y emulador.
- Sprint 4 (2 días): QA, accesibilidad, purga CSS, optimizaciones y despliegue en staging.

15. Reglas de aceptación por página / componente
- Cada página debe pasar checklist: responsive (móvil), pruebas de interacción, pruebas con emulador.
- Componentes documentados con props/variantes y ejemplos.

16. Documentación, scaffold y gobernanza
- Mantener documentación en `docs/`: `Project_chapter.md`, `DESIGN_GUIDE.md`, `COMPONENTS.md`.
- Scaffold recomendado: Vite + Tailwind + Firebase Emulator + ejemplos de configs en `docs/`.

17. Próximos pasos y confirmaciones
- Confirmar: 1) uso de Firebase emulador + Plan Spark, 2) páginas prioritarias (por defecto: Landing + Auth), 3) consentimiento para crear scaffold cuando quieras.

Anexos
- `docs/DESIGN_TOKENS.example.json` y `docs/tailwind.config.example.js` incluyen la paleta y tokens propuestos.

Fin del documento.
firebase deploy --only hosting

# deploy a preview channel
firebase hosting:channel:deploy staging-<branch>
```

12. Milestones y estimación (iterativa)
- Sprint 0 (1 día): Setup repo, Tailwind/Vite, configs, estructura de carpetas.
- Sprint 1 (3-4 días): Implementar Design System básico y componentes; Landing + Auth.
- Sprint 2 (4-6 días): Listados, perfil profesional, CRUD servicios y galería.
- Sprint 3 (3-4 días): Reserva básica, integración con Firestore, reglas y emulador.
- Sprint 4 (2 días): QA, accesibilidad, purga CSS, optimizaciones y despliegue en staging.

13. Reglas de aceptación por página / componente
- Cada página debe pasar checklist: responsive (móvil), pruebas de interacción, pruebas con emulador.
- Componentes deben documentarse con props/variantes y ejemplos.

14. Documentación y gobernanza
- Mantener documentación en `docs/`: `Project_chapter.md`, `DESIGN_GUIDE.md`, `COMPONENTS.md`.
- Workflow: feature branch → PR → revisión de diseño + QA → merge.

15. Entregables finales (MVP ready)
- Frontend desplegado en Firebase Hosting (canal staging y production configurados).
- Funcionalidad mínima: auth, roles, publicar/listar servicios, reservar, gestionar perfil.
- Repositorio con tests básicos, documentación y configuración para continuidad.

16. Próximos pasos inmediatos (sin crear archivos automáticamente)
- Confirmar: 1) uso de Firebase emulador + Plan Spark, 2) páginas prioritarias (por defecto: Landing + Auth), 3) consentimiento para crear scaffold cuando quieras.
- Cuando confirmes, puedo generar el scaffold y los archivos de configuración y/o pipelines CI.

17. Scaffold recomendado y guía de uso
-- ¿Qué es el scaffold y por qué usarlo aquí?
  - El scaffold es una base de proyecto lista para desarrollarse: configuraciones (Vite, Tailwind), estructura de carpetas, scripts y plantillas de componentes.
  - Beneficios para KalosEcommerce: arranque rápido, consistencia de código, integración temprana con el emulador de Firebase y scripts listos para build/deploy.

-- Contrato del scaffold
  - Inputs: confirmación del autor para crear archivos en el repo y elección de páginas prioritarias.
  - Outputs: archivos de configuración (tailwind.config.js, postcss.config.js, vite.config.js), `css/tailwind.css`, `index.html`, estructura `/src` (components, pages, config, utils), `firebase.json` básico y reglas ejemplo (`firestore.rules`, `storage.rules`), y `package.json` con scripts.
  - Error modes: si archivos existentes colisionan, el scaffold no sobrescribe sin confirmación; reporta conflictos para revisión.

-- Riesgos y mitigaciones
  - Riesgo: sobreescritura accidental de trabajo existente. Mitigación: el scaffold creará solo archivos nuevos o mostrará un listado de conflictos para aprobación manual.
  - Riesgo: decisiones de arquitectura tempranas que luego se cambien. Mitigación: mantener el scaffold minimalista y modular para permitir cambios.

-- Pasos para usar el scaffold (manual / PowerShell)
  - Nota: No ejecutes esto hasta confirmar que quieres que lo genere en el repo.

```powershell
# 1) Crear proyecto base con Vite (plantilla vanilla)
npm create vite@latest . -- --template vanilla

# 2) Instalar dependencias de desarrollo
npm install -D tailwindcss postcss autoprefixer vite @tailwindcss/forms @tailwindcss/typography

# 3) Inicializar Tailwind (crea tailwind.config.js y postcss.config.js)
npx tailwindcss init -p

# 4) Crear archivos base de CSS y estructura de carpetas
# (crear css/tailwind.css, src/components, src/pages, src/config, src/utils)

# 5) (Opcional) Instalar firebase-tools y preparar emulador
npm install -g firebase-tools
firebase init hosting,firestore,functions

# 6) Ejecutar emulador durante desarrollo
firebase emulators:start --only auth,firestore,storage

# 7) Scripts útiles en package.json
# "dev": "vite",
# "build": "vite build",
# "preview": "vite preview",
# "emulators": "firebase emulators:start --only auth,firestore,storage"
```

-- Qué incluiré en el scaffold si lo pides (lista concreta)
  - `package.json` con scripts (dev, build, preview, emulators)
  - `vite.config.js` (config mínima)
  - `postcss.config.js` y `tailwind.config.js` con tokens básicos
  - `css/tailwind.css` con directivas @tailwind
  - `index.html` y `src/` con componentes de ejemplo: Button, Card, Header, Footer, Auth form
  - `src/config/firebase-config.js` (loader que lee variables de entorno y exporta inicialización de Firebase)
  - `firebase.json`, `firestore.rules` y `storage.rules` de ejemplo pensados para el emulador
  - `docs/` con `DESIGN_GUIDE.md` y `COMPONENTS.md` básicos

Anexos rápidos
- Lista de comandos y recursos para desplegar y probar localmente se encuentran en la sección 11.

Fin del documento.

1. Visión y objetivos
- Visión: marketplace simple, seguro y accesible que conecte clientes y profesionales.  
- Roles principales:
  - Cliente: Buscar, filtrar y reservar servicios de belleza a domicilio.  
  - Profesional: Registra sus servicios, edita su perfil, gestiona su calendario y portfolio.
- Objetivos del MVP:
  - Autenticación (Email + Google).  
  - Roles: Cliente / Profesional.  
  - CRUD servicios profesionales + galería.  
  - Buscador filtrable y flujo de reserva básico.  
  - Sistema de diseño unificado en Tailwind CSS.  
  - Experiencia optimizada para móviles y rendimiento (lazy-loading, CSS purgado).

2. Alcance (Greenfield — Iteración 1)
- El proyecto se crea desde cero: no se reutiliza ni se migra CSS/HTML/JS previos.  
- Entregables:
  - Design System en Tailwind (tokens, componentes).  
  - Librería UI: Header, Footer, Button, Form, Card, Grid, Modal, Avatar, Inputs, Selects, DateTime wrapper.  
  - Plantillas/Layouts: Landing, Auth (login/register), Listing, Profile, Dashboard base.  
  - Configuración: tailwind.config.js, postcss.config.js, css/tailwind.css, package.json scripts, Vite.  
  - Documentación: DESIGN_GUIDE.md + componentes README + checklist.
- Comportamiento y características claves:
  - Profesionales ofrecen servicios a domicilio y gestionan agenda/portafolio.  
  - Clientes descubren, filtran y reservan servicios de forma segura.  
  - Mantenibilidad y rendimiento como requisitos no funcionales.

3. Stakeholders y roles
- Product Owner, Diseño, Devs (IA + humanos), QA — roles y entregables iguales a la versión aprobada.

4. Criterios de éxito (MVP)
- Componentes y páginas construidos desde cero usando el Design System.  
- Funcionalidad mínima operativa: auth, listados, perfil, reserva inicial.  
- Performance y seguridad básica (CSS purgado, lazy images, reglas Firestore en staging/emulador).  
- Mobile-first: navegación y flujos optimizados para pantallas pequeñas.

5. Arquitectura (frontend / backend)
- Tech stack (frontend): HTML5 + ES modules + Tailwind CSS + Vite + Firebase (Auth/Firestore/Storage).  
- Mobile-first: diseño y pruebas priorizadas para dispositivos móviles (breakpoints, touch targets, rendimiento).  
- Estructura inicial:
  - /index.html
  - /src/{components,templates,pages,config,utils}
  - /css/tailwind.css
  - tailwind.config.js, postcss.config.js, package.json
- Backend:
  - Firebase (preferible Plan Spark en arranque para minimizar costos).  
  - Recomendado: uso del Firebase Emulator Suite para desarrollo local y pruebas de reglas.

6. Design System y tokens
- Definir tokens primero (colores, tipografías, spacing, radios).  
- Mapear tokens en tailwind.config.js; freeze durante Sprint 1 salvo aprobación de diseño.

7. Plan de trabajo — milestones (resumido)
- Sprint 0 (setup, 1 día): scaffold desde cero, instalar Tailwind/PostCSS/Vite, crear config base.  
- Sprint 1 (componentes + templates, 3-4 días): implementar biblioteca de componentes y layouts.  
- Sprint 2 (páginas completas + flujos, 4-6 días): páginas y conexión básica con Firebase (emulador o staging).  
- Sprint 3 (QA + reglas + optimización, 2-3 días): pruebas, reglas Firestore, purga CSS, accesibilidad.

8. Reglas de aceptación por página
- Construcción exclusivamente con utilidades Tailwind y componentes aprobados.  
- Checklist visual y funcional completado antes de merge.

9. Seguridad y configuración
- No incluir secretos en el repo; usar .env y CI secrets.  
- Preferible usar Firebase emulador en desarrollo.

10. QA & pruebas
- Local: npm run dev (Vite) + Firebase Emulator Suite recomendado.  
- PR checklist: visual, responsive, accesibilidad, flujos auth, uploads.

11. Riesgos y mitigaciones
- Cambios en tokens → freeze tokens.  
- Discrepancias con diseños → aprobar componentes con equipo antes de páginas.  
- Exposición de claves → env + CI.

12. Documentación y gobernanza
- Documento principal: docs/Project_chapter.md (este archivo).  
- Diseños y tokens: docs/DESIGN_GUIDE.md.  
- Component library: src/components/README.md.  
- Workflow: feature branch → PR → revisión diseño + QA → merge.

13. Acciones inmediatas (arranque desde cero)
- Crear scaffold con Vite + Tailwind + PostCSS.  
- Generar archivos de configuración y css/tailwind.css.  
- Crear estructura /src y componentes base.  
- Crear plantillas base y scripts en package.json.  
- Configurar Firebase Emulator Suite y variables de entorno para credenciales.

14. Preguntas/confirmaciones necesarias para iniciar (responder rápido)
- Firebase: usar emulador (recomendado) o conectar a proyecto staging? (se propone iniciar con Plan Spark + emulador).  
- ¿Cuáles 2 páginas priorizar en Sprint 1? (si no se indica: Landing + Auth).  
- Confirmar permiso para crear archivos en el repo.

15. Comandos iniciales (PowerShell)
- npm install -D tailwindcss postcss autoprefixer vite @tailwindcss/forms @tailwindcss/typography  
- npx tailwindcss init -p

Entregables al final de Iteración 1
- Repo inicial desde cero con Tailwind configurado, componentes base y 2 páginas implementadas y documentadas.

Fin del documento.

18. Diseño: Página del profesional (pública y edición)

A) Vista pública — `/pro/:handle` (lo que ve el cliente)

Objetivo: permitir que un cliente descubra al profesional, revise categorías/servicios, vea portafolio y solicite reserva (sin pago en línea). Mostrar información clara, metadatos y CTA visible.

Estructura y componentes
- Header compacto: nombre (H1 — Fraunces 600) / ciudad, rating (opcional) y botón CTA `Solicitar reserva` (Kalos Coral #F74F4E).
- Identidad: H1 con nombre, claim corto (Inter 400), avatar/banner en top; metadata (tiempo de respuesta, experiencia breve).
- Categorías (chips): fila de chips filtrables (Peinados, Uñas, etc.); al seleccionar filtran el catálogo en cliente.
- Catálogo de servicios (grid responsivo): tarjetas con imagen, título, duración, precio (tabular-nums) y botón secundario para ver detalle.
- Panel de servicio (detalle público): modal o panel expandible con descripción, extras, duración, precio y CTA `Solicitar reserva` (si usuario no autenticado → redirigir a `/auth/login` con retorno al flujo).
- Portafolio: galería con thumbnails; soporte antes/después, leyendas y opción de abrir lightbox.
- Políticas & Cobertura: bloque con radio de atención (km), política de cancelación y métodos de pago informativos (sin integrar pasarela en MVP).
- Microcopy clave: mostrar claramente "Al solicitar, el profesional debe aceptar. Precio acordado: BOB {monto}."

Accesibilidad y rendimiento
- Contraste AA; tamaños mínimos 14 px para texto interactivo; áreas táctiles ≥44 px.
- Lazy-load en imágenes del portafolio; formatos WEBP/JPEG con fallbacks.
- Metatags y Open Graph para compartir (`/pro/:handle`) y SEO.

Comportamiento esperado
- CTA `Solicitar reserva` abre el flow `/reservar` o solicita login; snapshot de precio/título al crear booking.
- Filtrado por categoría sin recarga (client-side + sync con server para paginación).
- Si perfil `published == false` o no activo, mostrar mensaje y no exponer CTA.

B) Vista de edición — `/pro/editar` (lo que ve el profesional)

Objetivo: permitir al profesional configurar su escaparate: identidad, categorías, catálogo (servicios), portafolio, disponibilidad y políticas.

Layout (desktop preferente)
- Header de edición: botones `Vista previa` | `Guardar` | `Salir` (sticky superior).
- Barra lateral de categorías (chips): añadir/renombrar/ordenar/ocultar; seleccionar filtra catálogo.
- Master–Detail layout:
  - Izquierda (60–70%): lista/ grid del Catálogo — tarjetas con preview (imagen, título, precio, duración), toggles `Activo`, acciones: Editar / Duplicar / Eliminar. CTA `+ Nuevo servicio` (preselecciona la categoría activa).
  - Derecha (30–40%): Panel `SERVICIO` — formulario con: título, categoría, shortDesc, longDesc, duración (min), precio (BOB), atHome (boolean), imágenes (1–5), addons (nombre+precio), políticas específicas, toggles `Publicar` / `Despublicar`, botones `Guardar` / `Cancelar`.
- Sección Portafolio separada: multi-upload (1..60 items, MVP limit 5 por servicio recomendado), visibilidad público/oculto, emparejar antes/después, marcar portada de perfil/servicio, reordenar con drag & drop.
- Disponibilidad & Cobertura: editor semanal, buffers (minutos), maxPerDay, días off, radio km y recargo por distancia (informativo en MVP).

Validaciones y comportamiento clave
- Validaciones inline: `priceBOB >= 1`, `duration >= 15` minutos, imágenes tipo y tamaño (<= 5 MB), campos obligatorios.
- Cambios no guardados: toast y bloqueo de salida con confirmación.
- Catálogo ⇄ Panel: seleccionar tarjeta carga en panel; crear servicio abre panel en modo nuevo con valores por defecto.
- Portafolio: uploads con progress bar, previews, badges (PÚBLICO / OCULTO / ANTES / DESPUÉS / VIDEO), reorder drag & drop.
- Guardar: persistir y mostrar toast de éxito; en caso de error mostrar mensaje y mantener estado de edición.

Estilos y tokens aplicados (resumen)
- Tipografía: Fraunces 600 para H1 / H2; Inter 400/600/700 para UI y precios con tabular-nums.
- Colores:
  - CTA / Primario: `#F74F4E` (Kalos Coral)
  - Títulos / Acentos: `#303F56` (Deep Navy)
  - Fondos: `#FAFAFA` / `#F3E7DB`
  - Resaltos: `#FCBE3C` (Gold)
- Estados: éxito `#16A34A`, error `#DC2626`, info `#2563EB`.
- Grises: usar escala Gray-50..Gray-900 para superficies/bordes/textos.

Sin pasarela (UI rules)
- Todas las CTAs relacionadas con contratación usan el texto `Solicitar reserva` (no `Pagar`).
- Mostrar "Precio acordado (snapshot)" en la vista de reserva y en bookings tras la aceptación.
- Estados booking: `pending` → `accepted` (profesional) → `confirmed` (bloqueo agenda) → `done` / `cancelled`.

Criterios de aceptación rápidos (QA)
- Cambiar categoría filtra el catálogo sin recargar la página.
- Seleccionar/crear servicio abre el panel `SERVICIO` con validaciones inline.
- Guardar persiste, muestra toast y limpia el estado de cambios pendientes.
- Portafolio permite subir múltiples archivos, editar metadatos, emparejar A/D y reordenar.
- En la vista pública, `Solicitar reserva` inicia el flujo `/reservar` (sin pagos) y crea booking con `status: pending`.

Notas finales
- Mantener coherencia con el Design System global (tokens en `docs/DESIGN_TOKENS.example.json`).
- Documentar patrones de uso y componentes (e.g., `ServiceCard`, `ServicePanel`, `PortfolioUploader`) en `docs/COMPONENTS.md`.

Fin del documento.

---

ANEXOS COMPLETOS — Contenido de archivos referenciados

Este anexo incorpora íntegramente los ejemplos y seeds que se referencian en el capítulo para que `Project_chapter.md` sea la única fuente de verdad. Si prefieres mantener estos artefactos como archivos separados, puedo revertir la inserción.

### A: `docs/DESIGN_TOKENS.example.json`

```json
{
  "brand": {
    "primary": "#F74F4E",
    "primary-hover": "#E94445",
    "primary-pressed": "#D13C3B",
    "primary-subtle": "#FDEBEC",
    "secondary": "#303F56",
    "secondary-hover": "#2A394E",
    "secondary-pressed": "#233141",
    "secondary-subtle": "#E8EDF3",
    "gold": "#FCBE3C",
    "deep-coral": "#CA472B",
    "rosy": "#D6868D",
    "white": "#FAFAFA",
    "beige": "#F3E7DB",
    "black": "#261B15",
    "brown": "#8C6E64"
  },
  "neutral": {
    "gray-50": "#F8FAFC",
    "gray-100": "#F1F5F9",
    "gray-200": "#E5E7EB",
    "gray-400": "#9CA3AF",
    "gray-600": "#4B5563",
    "gray-900": "#111827"
  },
  "semantic": {
    "success": "#16A34A",
    "error": "#DC2626",
    "warning": "#FCBE3C",
    "info": "#2563EB"
  },
  "interaction": {
    "focus-ring": "#F74F4E66",
    "modal-overlay": "#00000099",
    "shadow-base": "rgba(0,0,0,0.14)"
  },
  "dark-mode": {
    "background": "#0F1115",
    "surface": "#17202B",
    "text": "#FAFAFA"
  },
  "accessibility": {
    "text-contrast-target": ">=4.5"
  }
}
```

### B: `docs/tailwind.config.example.js`

```javascript
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F74F4E",
          hover: "#E94445",
          pressed: "#D13C3B",
          subtle: "#FDEBEC"
        },
        navy: {
          DEFAULT: "#303F56",
          hover: "#2A394E",
          pressed: "#233141",
          subtle: "#E8EDF3"
        },
        gold: "#FCBE3C",
        "deep-coral": "#CA472B",
        rosy: "#D6868D",
        beige: "#F3E7DB",
        "kalos-white": "#FAFAFA",
        "kalos-black": "#261B15",
        brown: "#8C6E64",
        gray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E5E7EB",
          400: "#9CA3AF",
          600: "#4B5563",
          900: "#111827"
        },
        success: "#16A34A",
        error: "#DC2626",
        info: "#2563EB"
      },
      boxShadow: {
        base: "0 4px 16px rgba(0,0,0,0.14)"
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
}
```

### C: `.env.example` (completo)

```text
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID

# Optional: use emulator in development
VITE_USE_FIREBASE_EMULATOR=true
```

### D: Seeds (complete)

- `docs/seeds/users.json`:

```json
[
  {
    "uid": "admin_1",
    "role": "admin",
    "displayName": "Kalos Admin",
    "photoURL": "",
    "phone": "",
    "emailVerified": true,
    "createdAt": "2025-08-22T00:00:00Z",
    "updatedAt": "2025-08-22T00:00:00Z"
  },
  {
    "uid": "user_client_1",
    "role": "customer",
    "displayName": "Cliente Demo",
    "photoURL": "",
    "phone": "+59170000000",
    "emailVerified": true,
    "createdAt": "2025-08-22T00:00:00Z",
    "updatedAt": "2025-08-22T00:00:00Z"
  },
  {
    "uid": "pro_demo_1",
    "role": "professional",
    "displayName": "Sofia Estilista",
    "photoURL": "",
    "phone": "+59171111111",
    "emailVerified": true,
    "createdAt": "2025-08-22T00:00:00Z",
    "updatedAt": "2025-08-22T00:00:00Z"
  }
]
```

- `docs/seeds/professionals.json`:

```json
[
  {
    "uid": "pro_demo_1",
    "profile": {
      "displayName": "Sofia Estilista",
      "tagline": "Cortes y color a domicilio",
      "status": "available",
      "location": { "city": "La Paz", "lat": -16.4897, "lng": -68.1193, "radiusKm": 20 },
      "policies": { "depositPercent": 0, "cancelHours": 24, "paymentMethods": ["cash"] },
      "availability": { "weekly": { "mon": [["09:00","13:00"],["15:00","19:00"]] }, "bufferMin": 15, "maxPerDay": 8, "offDays": [] },
      "published": true,
      "updatedAt": "2025-08-22T00:00:00Z"
    }
  }
]
```

- `docs/seeds/services.json`:

```json
[
  {
    "serviceId": "svc_demo_1",
    "professionalId": "pro_demo_1",
    "title": "Corte femenino a domicilio",
    "categoryId": "cat_hair",
    "shortDesc": "Corte personalizado",
    "longDesc": "Corte y peinado a medida en la comodidad de tu hogar.",
    "durationMin": 45,
    "priceBOB": 120,
    "atHome": true,
    "active": true,
    "images": [],
    "addons": [{ "name": "Lavado", "priceBOB": 20 }],
    "order": 1,
    "createdAt": "2025-08-22T00:00:00Z",
    "updatedAt": "2025-08-22T00:00:00Z"
  }
]
```

- `docs/seeds/portfolio.json`:

```json
[
  {
    "itemId": "port_item_1",
    "professionalId": "pro_demo_1",
    "url": "/public/professionals/pro_demo_1/portfolio/port_item_1.jpg",
    "thumbUrl": "/public/professionals/pro_demo_1/portfolio/thumb_port_item_1.jpg",
    "caption": "Before/After",
    "alt": "Corte antes y después",
    "tags": ["corte","color"],
    "serviceId": "svc_demo_1",
    "phase": "result",
    "visibility": "public",
    "isProfileCover": true,
    "isServiceCover": false,
    "order": 1,
    "createdAt": "2025-08-22T00:00:00Z"
  }
]
```

- `docs/seeds/bookings.json`:

```json
[
  {
    "bookingId": "bk_demo_pending_1",
    "proId": "pro_demo_1",
    "customerId": "user_client_1",
    "serviceId": "svc_demo_1",
    "date": "2025-09-01",
    "start": "2025-09-01T10:00:00Z",
    "end": "2025-09-01T10:45:00Z",
    "priceBOB": 120,
    "status": "pending",
    "address": "Av. Demo 123",
    "notes": "Por favor traer productos hipoalergénicos",
    "createdAt": "2025-08-22T00:00:00Z",
    "updatedAt": "2025-08-22T00:00:00Z"
  },
  {
    "bookingId": "bk_demo_confirmed_1",
    "proId": "pro_demo_1",
    "customerId": "user_client_1",
    "serviceId": "svc_demo_1",
    "date": "2025-08-25",
    "start": "2025-08-25T14:00:00Z",
    "end": "2025-08-25T14:45:00Z",
    "priceBOB": 120,
    "status": "confirmed",
    "address": "Av. Demo 123",
    "notes": "Cliente solicita tinturado",
    "createdAt": "2025-08-20T00:00:00Z",
    "updatedAt": "2025-08-20T00:00:00Z"
  }
]
```

### E: `docs/checklist_firebase.md` (completo)

```markdown
# checklist_firebase.md — verificación rápida (15 items)

1. Auth Sign-in methods configurados (Email/Password) y verificación de correo exigida.
2. Firestore en Native mode creado.
3. Storage bucket configurado y reglas básicas aplicadas.
4. Reglas Firestore cargadas y coinciden con criterios funcionales (admin/professional/customer).
5. Reglas Storage cargadas y restringen tipos/tamaños.
6. Índices compuestos creados (bookings: proId+date, customerId+date; services: categoryId+active+order).
7. Proyectos separados: kalos-dev y kalos-prod con alias CLI.
8. Emulator Suite configurado y documentado (Auth/Firestore/Storage).
9. .env.example presente y documentado en README.
10. Seeds (docs/seeds/*.json) disponibles para cargar en emulador.
11. Cuenta admin creada en /users con role:"admin" (seed o manual).
12. Reglas de seguridad probadas con el emulador (casos: crear booking, aceptar booking, editar servicios).
13. Backups configurados o plan para backups (Firestore automated backups).
14. Límites y quotas documentados (imagenes por servicio, portafolio maximo).
15. Hosting y canal preview configurados para despliegues de PRs (opcional si se usa Hosting).

---

Instrucciones rápidas: usar `firebase emulators:start --only auth,firestore,storage` y la carpeta `docs/seeds` para poblar datos de prueba con scripts o con la UI del emulador.
```

### F: `docs/FIREBASE_SPEC.md` (extracto)

```markdown
# FIREBASE_SPEC — Kalos E-commerce

Este documento contiene la especificación de Firebase para el MVP tal como se solicitó.

1) Qué productos de Firebase usamos (MVP)

- Auth: Email/Password (verificación de correo obligatoria).
- Firestore (Native mode): datos de usuarios, profesionales, servicios, reservas.
- Storage: imágenes del perfil, servicios y portafolio.
- Emulators: Auth + Firestore + Storage para desarrollo local.
- Hosting (si lo usas): deploy de Vite.
- Functions (opcional desde Fase 2): notificaciones, validadores de reservas.

2) Estructura de proyectos y entornos

- Proyectos: kalos-dev y kalos-prod.
- Alias CLI: dev ↔ kalos-dev, prod ↔ kalos-prod.
- Colecciones top-level (Firestore): /users, /professionals/{uid}/..., /bookings, /public/featured.

3) Campos mínimos por colección (resumen)
- users: role, displayName, photoURL, phone, emailVerified
- professionals.profile: displayName, tagline, status, location, policies, availability, published
- services: title, categoryId, durationMin, priceBOB, active, images, addons
- portfolio: url, thumbUrl, caption, visibility, phase, order
- bookings: proId, customerId, serviceId, date, start, end, priceBOB, status

4) Reglas de seguridad (criterios funcionales)
- Solo admins: acceso completo.
- Professional: solo su subárbol y sus bookings.
- Customer: crear y leer sus bookings.
- Público: leer profiles/services/portfolio cuando publicado/activo.

5) Índices y convenciones de storage
- Índices sugeridos: bookings (proId+date), bookings (customerId+date), services (categoryId+active+order).
- Carpetas públicas: /public/professionals/{uid}/...

6) Entregables en repo
- `.env.example`, `docs/seeds/*.json`, `docs/checklist_firebase.md`, `firestore.rules`, `storage.rules`, `firebase.json` (recomendado).

---

Fin de los anexos.




## Stack Tecnológico
Frontend

Lenguajes / runtime: HTML5 + ES Modules + vanilla JS modular (posible migración a React/Vue/Svelte).
Bundler / dev server: Vite.
CSS: Tailwind CSS + PostCSS + Autoprefixer.
Plugins: @tailwindcss/forms, @tailwindcss/typography.
Design system: tokens (colores, tipografía, spacing) mapeados en tailwind.config.js.
Tipografías: Fraunces (titulos display), Inter (UI).
Estructura: /index.html, /src/{components,pages,config,utils}, /css/tailwind.css.
Backend / Plataforma

Firebase (MVP): Auth (Email/Password, verificación de correo), Firestore (Native mode), Storage (assets), Hosting.
Plan recomendado: Spark (arranque económico).
Opcional / Post‑MVP: Cloud Functions (notificaciones, validadores), FCM, email provider.
Desarrollo local / Emulación

Firebase Emulator Suite: Auth, Firestore, Storage.
Herramientas: firebase-tools, Node/npm.
Persistencia y modelo

Firestore collections: users, professionals/{uid} subcolecciones (profile, services, portfolio), services, bookings, reviews, public/featured.
Storage: /public/professionals/{uid}/..., /private/professionals/{uid}/drafts.
Seguridad / reglas

Reglas fuente: firestore.rules y storage.rules en repo; reglas probadas en el emulador.
.env / CI secrets para claves; no commitear service accounts.
CI / CD / despliegue

CI: GitHub Actions (build → tests → preview → deploy).
Hosting: Firebase Hosting (preview channels para PRs, deploy manual/automático a prod).
Secretos: FIREBASE_TOKEN en GitHub Secrets.
Testing / QA / Performance

Emulador para pruebas de reglas y flujos.
Lighthouse (móvil), pruebas E2E/manuales, accesibilidad (AA).
Seeds para emulador: docs/seeds/*.json.
Scripts y archivos clave en repo

package.json scripts sugeridos: dev, build, preview, emulators, seed:emulator.
Archivos recomendados: tailwind.config.js, postcss.config.js, vite.config.js, css/tailwind.css, firebase.json, firestore.rules, storage.rules, .env.example, docs/seeds/*.
Recomendaciones operativas rápidas

Desarrollar siempre con el emulator activado (VITE_USE_FIREBASE_EMULATOR=true).
Mantener tokens en DESIGN_TOKENS.example.json y mapear a tailwind.config.js.
Seeds y firestore.indexes.json para acelerar pruebas/local.
- Elige lo mejor

## Documentación


### 1. Especificaciones

Define la arquitectura apropiada según las directrices generales en `/docs/guidelines.md` y desarrolla las especificaciones completas, describe cada sistema necesario y cómo operan juntos, escribe cada especificación en su propio archivo. Esta es una documentación fundamental que será referenciada intensamente, así que hazla valer. Usa el directorio `/docs/specs`.


### 2. Plan

Describe un enfoque paso a paso para lograr este proyecto haciendo referencia a tus especificaciones. Ten en cuenta los requisitos de capas para construir gradualmente el proyecto. Agrupa funcionalidad relacionada o pasos en fases. Este es un documento único con la hoja de ruta general de un vistazo. Guarda esta salida en el archivo `/docs/plan.md`.


### 3. Tickets

Usa el `/docs/ticket-template.md` disponible.

Basado en `/docs/plan.md` y `/docs/specs.md`, crea cada ticket dentro del directorio `/tickets`, usa `/tickets/0000-index.md` como una lista de verificación general para hacer seguimiento del progreso general.

Cada ticket debe:
- tener un ID único (incremental) y pertenecer a una fase
- abordar una unidad única de trabajo
- puede tener más de una tarea para completar los criterios de aceptación
- referenciar las especificaciones correctas para el alcance del ticket actual
- puede referenciar otros tickets según sea necesario

