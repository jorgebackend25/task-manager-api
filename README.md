# Task Manager API

API REST para gestión de tareas con autenticación de usuarios. Este proyecto permite registrar usuarios, iniciar sesión, cerrar sesión y administrar tareas personales protegidas por autenticación.

## Descripción

Task Manager API es un backend construido con Node.js, Express y PostgreSQL. Cada usuario autenticado puede crear, listar, actualizar, completar, filtrar, paginar y eliminar únicamente sus propias tareas.

El proyecto está organizado por responsabilidades usando controladores, modelos, rutas, middlewares, schemas, utilidades y conexión a base de datos.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- JWT
- Cookies HTTP Only
- bcrypt
- Zod
- dotenv
- pnpm

## Funcionalidades principales

- Registro de usuarios
- Login con JWT guardado en cookie
- Logout eliminando la cookie del token
- Perfil del usuario autenticado
- CRUD completo de tareas
- Protección de rutas privadas
- Validación de datos con Zod
- Validación de parámetros de ruta
- Filtro de tareas por estado `complete`
- Ordenamiento por fecha de creación
- Paginación con `page`, `limit`, `offset`, `totalTasks` y `totalPages`
- Seguridad por usuario mediante `user_id`
- Separación de lógica en `controllers`, `models` y `utils`

## Estructura del proyecto

```txt
src/
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

.env.example
API_DOCUMENTATION.md
README.md
package.json
```

## Instalación

Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd task-manager-api
```

Instala las dependencias:

```bash
pnpm install
```

Crea el archivo `.env` usando como referencia `.env.example`:

```bash
cp .env.example .env
```

Configura tus variables de entorno reales dentro de `.env`.

## Variables de entorno

Ejemplo de `.env.example`:

```env
TOKEN_SECRET=your_token_secret
PORT=3000
NODE_ENV=development

DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=your_database_name
```

El archivo `.env` real no debe subirse a GitHub.

## Ejecución del proyecto

Modo desarrollo:

```bash
pnpm dev
```

Modo producción:

```bash
pnpm start
```

La API corre por defecto en:

```txt
http://localhost:3000
```

## Autenticación

La API usa JWT almacenado en una cookie llamada `token`.

La cookie se configura con opciones de seguridad:

```js
httpOnly: true
secure: process.env.NODE_ENV === "production"
sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
```

En desarrollo local, `secure` queda en `false` para permitir el uso con `localhost`. En producción, `secure` queda en `true` para trabajar con HTTPS.

## Endpoints principales

### Auth

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| POST | `/api/register` | Registra un nuevo usuario | No |
| POST | `/api/login` | Inicia sesión | No |
| GET | `/api/profile` | Obtiene el perfil del usuario autenticado | Sí |
| POST | `/api/logout` | Cierra sesión | Sí |

### Tasks

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| GET | `/api/tasks` | Lista tareas del usuario autenticado | Sí |
| GET | `/api/tasks/:id` | Obtiene una tarea específica | Sí |
| POST | `/api/tasks` | Crea una tarea | Sí |
| PUT | `/api/tasks/:id` | Actualiza título y descripción | Sí |
| PATCH | `/api/tasks/:id/complete` | Actualiza el estado `complete` | Sí |
| DELETE | `/api/tasks/:id` | Elimina una tarea | Sí |

## Query params en `GET /api/tasks`

La ruta `GET /api/tasks` soporta paginación y filtro por estado.

### Paginación

```txt
GET /api/tasks?page=1&limit=10
```

- `page`: número de página.
- `limit`: cantidad de tareas por página.

Si no se envían, se usan valores por defecto:

```txt
page = 1
limit = 10
```

### Filtro por estado

```txt
GET /api/tasks?complete=true
GET /api/tasks?complete=false
```

- `complete=true`: devuelve tareas completadas.
- `complete=false`: devuelve tareas pendientes.

También se puede combinar con paginación:

```txt
GET /api/tasks?page=1&limit=5&complete=false
```

## Ejemplo de respuesta de tareas

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Estudiar PostgreSQL",
      "description": "Practicar consultas SQL",
      "complete": false,
      "user_id": 2,
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

## Validaciones

El proyecto utiliza Zod para validar:

- Datos del body en registro y login.
- Datos del body al crear y actualizar tareas.
- Campo `complete` al actualizar estado de una tarea.
- Parámetro `id` en rutas como `/tasks/:id`.

Ejemplos de rutas inválidas:

```txt
GET /api/tasks/hola
GET /api/tasks/0
GET /api/tasks/-1
GET /api/tasks/1.5
```

Estas rutas deben responder con error `400` porque el `id` debe ser un número entero positivo.

## Seguridad aplicada

- Contraseñas hasheadas con bcrypt.
- JWT guardado en cookie HTTP Only.
- Rutas privadas protegidas con middleware de autenticación.
- Las tareas se consultan usando `user_id` para evitar que un usuario acceda a tareas de otro.
- Validación de datos de entrada antes de llegar a los controladores.
- Uso de variables de entorno para configuración sensible.

## Documentación completa de la API

La documentación detallada de endpoints, requests y responses está en:

```txt
API_DOCUMENTATION.md
```

## Estado del proyecto

Proyecto backend en desarrollo con estructura modular y funcionalidades principales terminadas.

Próximas mejoras recomendadas:

- Manejo centralizado de errores.
- Tests automatizados.
- Deploy en producción.
- Documentación con Swagger/OpenAPI.
- Refresh token.
- Roles y permisos si el sistema crece.

## Autor

Desarrollado como proyecto de aprendizaje backend con Node.js, Express y PostgreSQL.
