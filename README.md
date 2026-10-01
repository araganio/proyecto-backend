# Proyecto Backend — Node.js + Express

API REST de ejemplo para el curso **Programación Web** (UTP Pereira).

## Requisitos
- Node.js y npm

## Instalación
```bash
npm install
```

## Base de datos (PostgreSQL)
1. Instalar PostgreSQL 17 (usuario `postgres`, puerto `5432`) y DBeaver.
2. En DBeaver, conexión a `postgres` y ejecutar: `CREATE DATABASE bd_proyecto;`
3. Nueva conexión a `bd_proyecto` y ejecutar los scripts de la carpeta `database/`
   **en este orden**:
   - `01_creacion_tablas.sql` — crea las 6 tablas (`roles`, `permisos`, `roles_permisos`,
     `usuarios`, `proyectos`, `usuarios_proyectos`)
   - `02_insercion_datos.sql` — inserta los registros de prueba
   - `03_consultas_pruebas.sql` — consultas de verificación (opcional)

   El orden importa: una tabla no se puede crear antes que la tabla a la que referencia.

## Configuración
Copia `.env.example` a `.env` y ajusta los valores (puerto, credenciales de PostgreSQL).

## Ejecutar
```bash
npm run dev   # con nodemon (se reinicia solo al guardar cambios)
npm start     # modo normal
```

El servidor queda en `http://localhost:3000`.

## Endpoints

| Método | Ruta                       | Descripción                          | Requiere             |
|--------|----------------------------|--------------------------------------|----------------------|
| GET    | `/`                        | Estado de la API                     | —                    |
| POST   | `/api/auth/login`          | Inicia sesión, devuelve token        | —                    |
| GET    | `/api/usuarios`            | Usuarios del administrador del token | token + `visualizar` |
| GET    | `/api/usuarios?email=algo` | Los mismos, filtrados por email      | token + `visualizar` |
| GET    | `/api/usuarios/rol/:rol_id`| Usuarios de un rol                   | token + `visualizar` |
| GET    | `/api/usuarios/:id`        | Un usuario por id                    | token + `visualizar` |
| POST   | `/api/usuarios`            | Crea un usuario                      | token + `crear`      |
| PUT    | `/api/usuarios/:id`        | Actualiza un usuario                 | token + `actualizar` |
| DELETE | `/api/usuarios/:id`        | Elimina un usuario                   | token + `eliminar`   |
| GET    | `/api/proyectos`           | Si es admin: los que administra. Si es usuario: en los que participa | token + `visualizar` |
| GET    | `/api/proyectos/todos`     | Todos los proyectos del sistema      | token + `visualizar` |
| GET    | `/api/proyectos/:id`       | Un proyecto (solo si administra o participa) | token + `visualizar` |
| POST   | `/api/proyectos`           | Crea un proyecto                     | token + `crear`      |
| PUT    | `/api/proyectos/:id`       | Actualiza un proyecto                | token + `actualizar` |
| DELETE | `/api/proyectos/:id`       | Elimina un proyecto                  | token + `eliminar`   |
| POST   | `/api/proyectos/:id/usuarios` | Asigna **varios** usuarios: `{"usuarios_ids":[3,4]}` | token + `crear` |
| DELETE | `/api/proyectos/:id/usuarios/:usuario_id` | Quita un participante | token + `eliminar`   |

**Regla de pertenencia:** un administrador solo ve, modifica y elimina los usuarios
cuyo `administrador_id` es el suyo. Ese id se toma del token (`admin_from_token`),
no del body, para que nadie pueda suplantarlo. Si intenta tocar un usuario ajeno: `403`.

### Autenticación (JWT)
1. Login:
```
POST http://localhost:3000/api/auth/login
Body (raw, JSON): { "email": "juan@ejemplo.com", "password": "admin123" }
```
Devuelve `{ "token": "..." }`. Los datos del usuario (id, nombre, email, rol_id
y permisos) viajan dentro del token: el frontend puede decodificarlo para leerlos.

2. En las rutas protegidas, enviar el token en la cabecera:
```
Authorization: Bearer <token>
```

El token dura 1 hora. Los permisos viajan dentro del token como ids de la tabla
`permisos` (1 crear, 2 visualizar, 3 actualizar, 4 eliminar), y salen de la tabla
`roles_permisos`: el Administrador tiene los cuatro, el Usuario solo visualizar.
Los ids están en `src/utils/constants.js` para no escribirlos sueltos en el código.

Respuestas: `401` si falta el token o es inválido, `403` si el rol no tiene ese permiso.
La contraseña se guarda hasheada (bcrypt) y nunca se devuelve en las respuestas.

## Modelo de datos
```
permisos >── roles_permisos ──< roles ──< usuarios >── usuarios_proyectos ──< proyectos
                                            │  └── administrador_id → usuarios (autorreferenciada)
                                            └── proyectos.administrador_id → usuarios
```
- `roles`: Administrador, Usuario
- `permisos`: crear, visualizar, actualizar, eliminar
- `roles_permisos`: Administrador tiene los 4 permisos; Usuario solo visualizar
- `usuarios`: pertenece a un rol y (opcionalmente) a un administrador
- `proyectos`: pertenece a un administrador
- `usuarios_proyectos`: relación muchos a muchos entre usuarios y proyectos

**Reglas de borrado (ON DELETE):**
- `usuarios.administrador_id` → `SET NULL`: al eliminar un administrador, sus usuarios
  NO se borran, solo quedan sin administrador.
- `proyectos.administrador_id` → `CASCADE`: al eliminar un administrador, sus proyectos sí se eliminan.

## Estructura
```
src/
├── config/        → dotenv.js (variables de entorno) y db.js (instancia de Sequelize)
├── utils/         → constants.js (ids de roles y permisos)
├── controllers/   → reciben la petición y responden
├── services/      → lógica de negocio
├── models/        → un modelo por tabla + asociaciones.js (relaciones)
├── routes/        → definen las rutas
├── middlewares/   → funciones que se ejecutan antes del controlador
├── app.js         → configuración de Express
└── server.js      → authenticate() + sync() y enciende el servidor
database/
├── 01_creacion_tablas.sql   → CREATE TABLE de las 6 tablas
├── 02_insercion_datos.sql   → INSERT de los registros de prueba
└── 03_consultas_pruebas.sql → consultas de verificación
```
