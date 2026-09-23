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
3. Nueva conexión a `bd_proyecto` y ejecutar el script `database/schema.sql`
   (crea las 6 tablas: `roles`, `usuarios`, `proyectos`, `usuarios_proyectos`, `permisos`, `roles_permisos`).
   Ejecutar bloque por bloque, en orden: una tabla no se puede crear antes que la que referencia.

## Configuración
Copia `.env.example` a `.env` y ajusta los valores (puerto, credenciales de PostgreSQL).

## Ejecutar
```bash
npm run dev   # con nodemon (se reinicia solo al guardar cambios)
npm start     # modo normal
```

El servidor queda en `http://localhost:3000`.

## Endpoints

| Método | Ruta                | Descripción              | Protegida |
|--------|---------------------|--------------------------|-----------|
| GET    | `/`                 | Estado de la API         | No        |
| GET    | `/api/usuarios`     | Lista todos los usuarios | No        |
| GET    | `/api/usuarios/:id` | Un usuario por id        | No        |
| POST   | `/api/usuarios`     | Crea un usuario          | Sí        |
| PUT    | `/api/usuarios/:id` | Actualiza un usuario     | Sí        |
| DELETE | `/api/usuarios/:id` | Elimina un usuario       | Sí        |

Las rutas protegidas necesitan la cabecera `x-api-key` con el valor de `API_KEY` del `.env`.
La contraseña se guarda hasheada (bcrypt) y nunca se devuelve en las respuestas.

Ejemplo con Postman: método `POST`, URL `http://localhost:3000/api/usuarios`,
Headers → `x-api-key: clave-secreta-123`, Body (raw, JSON):
```json
{ "nombre": "Ana", "email": "ana@ejemplo.com", "password": "123456", "rol_id": 2, "administrador_id": 1 }
```

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
├── controllers/   → reciben la petición y responden
├── services/      → lógica de negocio
├── models/        → un modelo por tabla + asociaciones.js (relaciones)
├── routes/        → definen las rutas
├── middlewares/   → funciones que se ejecutan antes del controlador
├── app.js         → configuración de Express
└── server.js      → authenticate() + sync() y enciende el servidor
database/
└── schema.sql     → script SQL de creación de tablas
```
