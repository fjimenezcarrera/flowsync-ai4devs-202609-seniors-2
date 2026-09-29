# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

FlowSync: gestión de tareas en equipo (proyecto de práctica del curso AI4Devs). Monorepo sin workspaces con dos apps independientes, cada una con su propio `package.json` y `node_modules`:

- `backend/` — API REST en AdonisJS 7 + Lucid (SQLite vía `better-sqlite3`), puerto 3333.
- `frontend/` — React 19 + Vite 8 + TypeScript + Tailwind v4 + shadcn/ui, puerto 5173. Consume la API de autenticación (login, registro, perfil).

Lo único construido es la autenticación (backend y frontend). No existe aún nada del dominio (tareas, proyectos, equipos). La documentación del proyecto y los PRD van en español (`doc/prd/`).

## Comandos

Backend (desde `backend/`):

```bash
npm install
cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run                          # también regenera database/schema.ts
npm run dev                                     # node ace serve --hmr
npm test                                        # node ace test (Japa)
node ace test functional                        # una sola suite (unit | functional)
node ace test --files=tests/functional/auth.spec.ts   # un solo archivo
node ace test --tests="nombre exacto del test"        # un solo test
npm run lint && npm run typecheck
npm run format                                  # prettier (@adonisjs/prettier-config)
```

Frontend (desde `frontend/`):

```bash
npm install
npm run dev
npm run build     # tsc -b && vite build
npm run lint      # oxlint (no ESLint)
npm run format    # prettier (sin punto y coma, comillas simples)
```

El frontend no tiene runner de tests. Un hook `PostToolUse` de Claude Code (`.claude/settings.json` → `.claude/hooks/format-frontend.sh`) pasa Prettier a cada archivo de `frontend/` que se edita.

## Arquitectura del frontend

- **Alias** `@/*` → `src/*` (en `tsconfig*.json` y `vite.config.ts`).
- **UI**: componentes de shadcn/ui en `src/components/ui/` (generados con `npx shadcn@latest add <componente>`; no editar salvo necesidad). `cn()` viene del paquete `cn` vía `src/lib/utils.ts`.
- **API**: `src/lib/api.ts` es un wrapper de `fetch` sobre `VITE_API_URL` (por defecto `http://localhost:3333`) que desenvuelve `{ data }` y lanza `ApiError` (estado no 2xx) o `NetworkError`. Los tipos de respuesta están escritos a mano en `src/lib/types.ts`; no se usa el registro de Tuyau del backend (sus imports `#...` no resuelven desde el frontend).
- **Errores**: `src/lib/errors.ts` traduce los errores de la API a mensajes en español (`toFormErrors`) y replica las reglas de validación del backend para validar en cliente.
- **Sesión**: `src/auth/` guarda el token opaco en `localStorage` (`flowsync.token`) y lo expone con `useAuth()`. `RequireAuth` y `GuestOnly` protegen las rutas. Un 401 en la vista protegida limpia la sesión.
- **Rutas** (`react-router`, en `src/App.tsx`): `/` (perfil, protegida), `/login` y `/signup`.

## Arquitectura del backend

**Rutas** (`start/routes.ts`): todo cuelga de `/api/v1`. Los controladores se referencian a través del objeto generado `controllers` de `#generated/controllers` (`[controllers.NewAccount, 'store']`), no importándolos directamente. El grupo `/account` está protegido con `.use(middleware.auth())`; `auth/signup` y `auth/login` son públicos.

**Código generado — no editar a mano**, se regenera solo:
- `.adonisjs/server/controllers.ts` y `.adonisjs/client/registry/*` (registro tipado de Tuyau): los generan los hooks `indexEntities` / `generateRegistry` de `adonisrc.ts` al arrancar `node ace` (dev server, tests…). Al añadir un controlador o ruta nueva, arranca `npm run dev` (o cualquier comando ace) para que aparezcan. Están versionados en el repo.
- `database/schema.ts`: clases `*Schema` con las columnas, regeneradas por `node ace migration:run` a partir de las migraciones (reglas extra en `database/schema_rules.ts`). Los modelos **extienden** esas clases (`class User extends compose(UserSchema, ...)`) en lugar de declarar columnas con `@column`. Para cambiar columnas: nueva migración → `migration:run`.

**Respuestas**: `providers/api_provider.ts` añade `ctx.serialize()` a `HttpContext`, que envuelve toda respuesta en `{ data: ... }` (y valida metadatos de paginación de Lucid). Los controladores nunca devuelven modelos crudos: pasan por un transformer de `app/transformers/` (`BaseTransformer` con `this.pick(...)`). `ctx.serialize.withoutWrapping()` existe para casos sin envoltorio. `force_json_response_middleware` fuerza JSON en todas las respuestas, incluidos errores.

**Autenticación**: guard por defecto `api` = access tokens opacos en BD (`User.accessTokens = DbAccessTokensProvider.forModel(User)`, tabla `auth_access_tokens`); el cliente manda `Authorization: Bearer <token>`. Signup y login devuelven `{ data: { user, token } }`. Existe también un guard `web` de sesión configurado pero no usado por las rutas. `silent_auth_middleware` hace `auth.check()` en todas las rutas; la protección real la da el middleware nombrado `auth`.

**Validación**: VineJS 4 en `app/validators/`, con builders de campo compartidos (`email()`, `password()`) y `vine.create(...)`; en el controlador, `request.validateUsing(validator)`. `start/validator.ts` convierte globalmente las fechas de Vine a Luxon `DateTime`.

**Imports**: usar los alias subpath de `package.json` (`#models/*`, `#validators/*`, `#transformers/*`, `#controllers/*`, `#start/*`, etc.) en vez de rutas relativas. Los alias apuntan a `.js` (ESM), aunque el fuente sea `.ts`.

**Base de datos**: SQLite en `backend/tmp/db.sqlite3`. `.env.test` solo cambia `SESSION_DRIVER=memory`, así que los tests usan el mismo fichero de BD que desarrollo salvo que se aísle (p. ej. transacciones globales o `testUtils.db().truncate()` en el setup).

**Tests**: Japa con suites `unit` (`tests/unit/**/*.spec.ts`, timeout 2s) y `functional` (`tests/functional/**/*.spec.ts`, timeout 30s; arranca el servidor HTTP). Los plugins `apiClient`, `authApiClient` (`.loginAs(user)`) y `dbAssertions` están cargados en `tests/bootstrap.ts`, y el api client está tipado contra el registro de Tuyau. Aún no existe ningún test ni esos directorios.

**CORS**: en desarrollo acepta cualquier origen (`config/cors.ts`); en producción la lista está vacía.
