# Arquitectura de FlowSync

Diagrama de contenedores (estilo C4) de FlowSync tal y como está hoy en el código. Hay una SPA de React (`frontend/`) que guarda el token de sesión en `localStorage` y habla con el backend solo a través de `src/lib/api.ts`. El backend es una API AdonisJS (`backend/`) que expone `/api/v1/auth`, `/api/v1/account` y `/api/v1/tasks`, y persiste en un único fichero SQLite mediante Lucid. Las cajas resumen qué hay dentro de cada contenedor: pantallas, controladores, modelos, transformers y tablas. Todo sale de los ficheros del repo; no se dibuja nada que el código no tenga, como despliegues, colas o servicios externos.

```mermaid
C4Container
  title FlowSync: diagrama de contenedores

  Person(member, "Miembro del equipo", "Apunta tareas y consulta en qué anda cada uno")

  System_Boundary(flowsync, "FlowSync") {
    Container(spa, "Frontend SPA", "React 19, Vite 8, react-router, Tailwind v4, shadcn/ui", "Sirve en :5173. Pantallas /login, /register, /tasks, /tasks/:id y /profile con guards ProtectedRoute y PublicOnlyRoute. AuthProvider rehidrata la sesión con GET /account/profile")
    ContainerDb(storage, "localStorage del navegador", "Web Storage", "Clave flowsync.token: el access token de la sesión")
    Container(api, "API REST", "AdonisJS 7, VineJS 4, Auth 10", "Sirve en :3333 bajo /api/v1. Controladores NewAccount, AccessTokens, Profile, Tasks, TaskStatuses y TaskDueDates. Guard por defecto api (access tokens opacos). Respuestas envueltas en { data } vía serialize() con los transformers User, Task, TaskDetail y TaskAssignee")
    ContainerDb(db, "Base de datos", "SQLite (better-sqlite3) vía Lucid 22", "Fichero tmp/db.sqlite3. Tablas users, auth_access_tokens y tasks. Modelos User y Task (belongsTo assignee)")
  }

  Rel(member, spa, "Usa", "Navegador")
  Rel(spa, storage, "Guarda, lee y borra el token")
  UpdateRelStyle(spa, storage, $offsetX="-60", $offsetY="-30")
  Rel(spa, api, "signup, login, logout, profile, listar/crear/consultar tareas, cambiar estado y fecha", "fetch JSON, Authorization: Bearer")
  Rel(api, db, "Lee y escribe", "Lucid ORM")
  UpdateRelStyle(api, db, $offsetX="-40", $offsetY="-40")
```
