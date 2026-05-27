# Task Manager API - Documentación

API REST para gestión de tareas con autenticación de usuarios. Permite registrar usuarios, iniciar sesión, cerrar sesión, consultar perfil y administrar tareas propias mediante operaciones CRUD.

## Tabla de contenidos

1. Descripción general
2. Tecnologías
3. Variables de entorno
4. Autenticación
5. Formato de respuestas
6. Endpoints de autenticación
7. Endpoints de tareas
8. Paginación y filtros
9. Códigos de estado
10. Estructura recomendada del proyecto
11. Notas de seguridad

---

## 1. Descripción general

Task Manager API es una API backend construida con Node.js, Express y PostgreSQL. Cada usuario autenticado puede crear, listar, consultar, actualizar, completar o eliminar únicamente sus propias tareas.

La API incluye:

- Registro de usuarios.
- Login con JWT almacenado en cookie.
- Logout limpiando la cookie.
- Perfil del usuario autenticado.
- CRUD de tareas.
- Validación de datos con Zod.
- Validación de parámetros `:id`.
- Paginación en listado de tareas.
- Ordenamiento por fecha de creación.
- Filtro opcional por estado `complete`.
- Separación por capas: controllers, models, middlewares, schemas y utils.

---

## 2. Tecnologías

- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- jsonwebtoken
- cookie-parser
- Zod
- dotenv
- pnpm

---

## 3. Variables de entorno

Crear un archivo `.env` en la raíz del proyecto usando como base `.env.example`.

Ejemplo:

```env
TOKEN_SECRET=your_token_secret
PORT=3000
NODE_ENV=development

DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database_name
```

### Variables

| Variable | Descripción |
|---|---|
| `TOKEN_SECRET` | Clave secreta usada para firmar tokens JWT. |
| `PORT` | Puerto donde corre el servidor. |
| `NODE_ENV` | Ambiente de ejecución. En local usar `development`; en producción usar `production`. |
| `DB_USER` | Usuario de PostgreSQL. |
| `DB_PASSWORD` | Contraseña de PostgreSQL. |
| `DB_HOST` | Host de la base de datos. Normalmente `localhost` en desarrollo. |
| `DB_PORT` | Puerto de PostgreSQL. Normalmente `5432`. |
| `DB_DATABASE` | Nombre de la base de datos. |

---

## 4. Autenticación

La API usa JWT guardado en una cookie llamada `token`.

Cuando el usuario hace login o register correctamente, el servidor responde con una cookie HTTP.

Configuración recomendada de cookie:

```js
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24,
};

export const clearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};
```

### Explicación

- `httpOnly`: evita que JavaScript del frontend pueda leer la cookie.
- `secure`: en producción obliga a usar HTTPS.
- `sameSite`: ayuda a controlar cuándo se envía la cookie entre sitios.
- `maxAge`: define duración de la cookie. En este caso, 1 día.

Las rutas protegidas requieren que el usuario tenga una cookie válida.

---

## 5. Formato de respuestas

### Respuesta exitosa general

```json
{
  "message": "operación realizada correctamente"
}
```

### Respuesta de error general

```json
{
  "message": "error interno"
}
```

### Respuesta de validación

```json
{
  "message": [
    "El id debe ser un número positivo"
  ]
}
```

O también:

```json
{
  "message": "page y limit deben ser números positivos"
}
```

---

## 6. Endpoints de autenticación

> Nota: el prefijo puede variar según cómo tengas montadas tus rutas. En esta documentación se usa `/api` como ejemplo.

### Registrar usuario

```http
POST /api/register
```

También puede estar montado como:

```http
POST /api/auth/register
```

según tu archivo principal de rutas.

#### Body

```json
{
  "username": "jorge",
  "email": "jorge@example.com",
  "password": "123456"
}
```

#### Respuesta exitosa

```json
{
  "message": "usuario creado correctamente",
  "user": {
    "id": 1,
    "username": "jorge",
    "email": "jorge@example.com",
    "created_at": "2026-05-26T20:00:00.000Z"
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `409` | Username ya registrado. |
| `409` | Email ya registrado. |
| `400` | Datos inválidos si se usa validación con Zod. |
| `500` | Error interno. |

---

### Iniciar sesión

```http
POST /api/login
```

También puede estar montado como:

```http
POST /api/auth/login
```

#### Body

```json
{
  "email": "jorge@example.com",
  "password": "123456"
}
```

#### Respuesta exitosa

```json
{
  "id": 1,
  "email": "jorge@example.com"
}
```

Además, el servidor crea una cookie llamada `token`.

#### Errores posibles

| Código | Causa |
|---|---|
| `401` | Credenciales inválidas. |
| `400` | Datos inválidos si se usa validación con Zod. |
| `500` | Error interno. |

---

### Obtener perfil

```http
GET /api/profile
```

También puede estar montado como:

```http
GET /api/auth/profile
```

Ruta protegida. Requiere cookie `token` válida.

#### Respuesta exitosa

```json
{
  "id": 1,
  "email": "jorge@example.com"
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `401` | Usuario no autenticado o token inválido. |
| `404` | Usuario no encontrado. |
| `500` | Error interno. |

---

### Cerrar sesión

```http
POST /api/logout
```

También puede estar montado como:

```http
POST /api/auth/logout
```

El servidor limpia la cookie `token`.

#### Respuesta exitosa

```json
{
  "message": "sesion cerrada correctamente"
}
```

---

## 7. Endpoints de tareas

Todas las rutas de tareas son protegidas. El usuario solo puede acceder a las tareas que pertenecen a su propio `user_id`.

---

### Listar tareas

```http
GET /api/tasks
```

Devuelve tareas del usuario autenticado, ordenadas desde la más reciente hasta la más antigua.

#### Query params opcionales

| Query | Tipo | Descripción | Default |
|---|---|---|---|
| `page` | number | Página actual. | `1` |
| `limit` | number | Cantidad de tareas por página. | `10` |
| `complete` | string | Filtra por estado. Acepta `true` o `false`. | Sin filtro |

#### Ejemplos

```http
GET /api/tasks
GET /api/tasks?page=1&limit=5
GET /api/tasks?complete=true
GET /api/tasks?complete=false
GET /api/tasks?page=2&limit=5&complete=false
```

#### Respuesta exitosa

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Estudiar PostgreSQL",
      "description": "Repasar SELECT, WHERE y ORDER BY",
      "complete": false,
      "user_id": 1,
      "created_at": "2026-05-26T20:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "offset": 0,
    "totalTasks": 25,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | `page` o `limit` no son números. |
| `400` | `page` o `limit` no son positivos. |
| `400` | `complete` no es `true` ni `false`. |
| `401` | Usuario no autenticado. |
| `500` | Error interno. |

---

### Obtener una tarea por id

```http
GET /api/tasks/:id
```

Ruta protegida. Devuelve una tarea específica solo si pertenece al usuario autenticado.

#### Params

| Param | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de la tarea. Debe ser entero positivo. |

#### Respuesta exitosa

```json
{
  "task": {
    "id": 1,
    "title": "Estudiar PostgreSQL",
    "description": "Repasar SELECT, WHERE y ORDER BY",
    "complete": false,
    "user_id": 1,
    "created_at": "2026-05-26T20:00:00.000Z"
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | ID inválido. |
| `401` | Usuario no autenticado. |
| `404` | Tarea no encontrada. |
| `500` | Error interno. |

---

### Crear tarea

```http
POST /api/tasks
```

Ruta protegida.

#### Body

```json
{
  "title": "Estudiar backend",
  "description": "Practicar rutas, controladores y modelos"
}
```

#### Respuesta exitosa

```json
{
  "message": "tarea creada correctamente",
  "task": {
    "id": 1,
    "title": "Estudiar backend",
    "description": "Practicar rutas, controladores y modelos",
    "complete": false,
    "user_id": 1,
    "created_at": "2026-05-26T20:00:00.000Z"
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | Body inválido. |
| `401` | Usuario no autenticado. |
| `500` | Error interno. |

---

### Actualizar tarea

```http
PUT /api/tasks/:id
```

Actualiza `title` y `description` de una tarea específica.

#### Params

| Param | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de la tarea. Debe ser entero positivo. |

#### Body

```json
{
  "title": "Nuevo título",
  "description": "Nueva descripción"
}
```

#### Respuesta exitosa

```json
{
  "message": "tarea actualizada correctamente",
  "task": {
    "id": 1,
    "title": "Nuevo título",
    "description": "Nueva descripción",
    "complete": false,
    "user_id": 1,
    "created_at": "2026-05-26T20:00:00.000Z"
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | ID inválido o body inválido. |
| `401` | Usuario no autenticado. |
| `404` | Tarea no encontrada. |
| `500` | Error interno. |

---

### Marcar tarea como completada o pendiente

```http
PATCH /api/tasks/:id/complete
```

Actualiza solamente el campo `complete`.

#### Params

| Param | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de la tarea. Debe ser entero positivo. |

#### Body

```json
{
  "complete": true
}
```

O:

```json
{
  "complete": false
}
```

#### Respuesta exitosa

```json
{
  "message": "tarea actualizada",
  "task": {
    "id": 1,
    "title": "Estudiar backend",
    "description": "Practicar rutas, controladores y modelos",
    "complete": true,
    "user_id": 1,
    "created_at": "2026-05-26T20:00:00.000Z"
  }
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | ID inválido o `complete` no es booleano. |
| `401` | Usuario no autenticado. |
| `404` | Tarea no encontrada. |
| `500` | Error interno. |

---

### Eliminar tarea

```http
DELETE /api/tasks/:id
```

Elimina una tarea específica solo si pertenece al usuario autenticado.

#### Params

| Param | Tipo | Descripción |
|---|---|---|
| `id` | number | ID de la tarea. Debe ser entero positivo. |

#### Respuesta exitosa

```json
{
  "message": "tarea eliminada correctamente"
}
```

#### Errores posibles

| Código | Causa |
|---|---|
| `400` | ID inválido. |
| `401` | Usuario no autenticado. |
| `404` | Tarea no encontrada. |
| `500` | Error interno. |

---

## 8. Paginación y filtros

### Paginación

La paginación usa:

```txt
page
limit
offset
```

Fórmula:

```txt
offset = (page - 1) * limit
```

Ejemplo:

```http
GET /api/tasks?page=3&limit=5
```

Cálculo:

```txt
offset = (3 - 1) * 5
offset = 10
```

La API saltará las primeras 10 tareas y traerá las siguientes 5.

### Total de páginas

La API usa `COUNT(*)` para contar las tareas totales del usuario y calcular:

```txt
totalPages = Math.ceil(totalTasks / limit)
```

Ejemplo:

```txt
totalTasks = 25
limit = 10
totalPages = 3
```

### Filtro por complete

```http
GET /api/tasks?complete=true
```

Devuelve tareas completadas.

```http
GET /api/tasks?complete=false
```

Devuelve tareas pendientes.

Si `complete` no viene en la URL, devuelve todas las tareas del usuario.

---

## 9. Códigos de estado

| Código | Significado | Uso en la API |
|---|---|---|
| `200` | OK | Operación exitosa. |
| `201` | Created | Usuario o tarea creada correctamente. |
| `400` | Bad Request | Datos inválidos en body, params o query. |
| `401` | Unauthorized | Usuario no autenticado o credenciales inválidas. |
| `404` | Not Found | Recurso no encontrado. |
| `409` | Conflict | Usuario o email ya registrado. |
| `500` | Internal Server Error | Error interno del servidor. |

---

## 10. Estructura recomendada del proyecto

```txt
src/
  config/
    cookie.config.js

  controllers/
    auth.controller.js
    tasks.controller.js

  database/
    db.js

  libs/
    jwt.js

  middlewares/
    validateSchema.js
    validateParams.js
    validatetoken.js

  models/
    task.model.js
    user.model.js

  routes/
    auth.routes.js
    tasks.routes.js

  schemas/
    auth.schema.js
    tasks.schema.js

  utils/
    pagination.js
    parseCompleteFilter.js

  app.js
  config.js
  index.js
```

### Responsabilidad de cada carpeta

| Carpeta | Responsabilidad |
|---|---|
| `controllers` | Manejan `req`, `res`, status codes y flujo HTTP. |
| `models` | Contienen consultas SQL hacia PostgreSQL. |
| `utils` | Contienen funciones reutilizables como paginación y parseo de filtros. |
| `middlewares` | Validan tokens, bodies y params antes de llegar al controlador. |
| `schemas` | Definen reglas de validación con Zod. |
| `database` | Conexión a PostgreSQL. |
| `libs` | Funciones internas como creación/verificación de JWT. |
| `config` | Configuraciones reutilizables, por ejemplo cookies. |
| `routes` | Definen los endpoints y conectan middlewares con controladores. |

---

## 11. Notas de seguridad

- No subir `.env` a GitHub.
- Subir solo `.env.example`.
- Usar `httpOnly: true` en cookies.
- Usar `secure: true` en producción.
- Validar `body`, `params` y `query`.
- No devolver contraseñas en respuestas.
- Hashear contraseñas con bcrypt.
- Filtrar tareas siempre por `user_id` para evitar acceso a datos de otros usuarios.
- Usar mensajes genéricos en login para no revelar si el email existe.

---

## Estado actual del proyecto

La API actualmente cuenta con:

- Autenticación funcional.
- Cookies más seguras.
- CRUD completo de tareas.
- Validaciones con Zod.
- Validación de params.
- Paginación profesional.
- Filtros por estado.
- Conteo total de tareas.
- Separación de responsabilidades en controllers, models y utils.

