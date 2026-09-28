-- ============================================================
-- SCRIPT 1 DE 3: CREACIÓN DE LAS TABLAS
-- Base de datos: bd_proyecto  (PostgreSQL)
-- Proyecto: Plataforma de gestión de usuarios y proyectos
-- Juan Felipe Londoño Marín - Programación Web TS5C4 - UTP
-- ============================================================
--
-- ANTES DE EJECUTAR ESTE SCRIPT:
--   Conectarse a la base de datos "postgres" y ejecutar:
--       CREATE DATABASE bd_proyecto;
--   Luego crear una conexión nueva a "bd_proyecto" y ejecutar este script.
--
-- ORDEN DE EJECUCIÓN: se ejecuta bloque por bloque, de arriba hacia abajo.
-- No se puede cambiar el orden porque una tabla no se puede crear antes
-- que la tabla a la que hace referencia con una clave foránea.
--   roles -> usuarios -> proyectos -> usuarios_proyectos
--   permisos -> roles_permisos
-- ============================================================


-- ------------------------------------------------------------
-- TABLA 1: roles
-- Catálogo de roles del sistema (Administrador y Usuario).
-- Se crea primero porque la tabla usuarios depende de ella.
-- ------------------------------------------------------------
CREATE TABLE roles (
  id     SERIAL PRIMARY KEY,           -- SERIAL: el id se genera solo, consecutivo
  nombre VARCHAR(50) NOT NULL UNIQUE   -- NOT NULL: obligatorio / UNIQUE: no se repite
);


-- ------------------------------------------------------------
-- TABLA 2: permisos
-- Catálogo de acciones que se pueden realizar en el sistema.
-- ------------------------------------------------------------
CREATE TABLE permisos (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);


-- ------------------------------------------------------------
-- TABLA 3: roles_permisos
-- Tabla intermedia: relaciona qué permisos tiene cada rol.
-- Es de muchos a muchos: un rol tiene varios permisos y un
-- permiso puede pertenecer a varios roles.
-- ------------------------------------------------------------
CREATE TABLE roles_permisos (
  id         SERIAL PRIMARY KEY,
  rol_id     INTEGER NOT NULL,
  permiso_id INTEGER NOT NULL,

  -- Claves foráneas: garantizan que el rol y el permiso existan
  FOREIGN KEY (rol_id)     REFERENCES roles(id)    ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE,

  -- No se puede asignar dos veces el mismo permiso al mismo rol
  UNIQUE (rol_id, permiso_id)
);


-- ------------------------------------------------------------
-- TABLA 4: usuarios
-- Personas que usan el sistema.
-- Depende de roles, por eso se crea después.
-- ------------------------------------------------------------
CREATE TABLE usuarios (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,  -- no puede haber dos usuarios con el mismo correo
  password         VARCHAR(255) NOT NULL,         -- se guarda hasheada, nunca en texto plano
  rol_id           INTEGER NOT NULL,              -- todo usuario debe tener un rol
  administrador_id INTEGER,                       -- puede ser NULL: un administrador no tiene administrador

  -- Clave foránea hacia roles
  FOREIGN KEY (rol_id) REFERENCES roles(id),

  -- Clave foránea AUTORREFERENCIADA: la tabla se relaciona consigo misma.
  -- ON DELETE SET NULL: si se elimina un administrador, sus usuarios NO se
  -- borran, solo quedan sin administrador asignado.
  FOREIGN KEY (administrador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);


-- ------------------------------------------------------------
-- TABLA 5: proyectos
-- Proyectos registrados y su administrador responsable.
-- Depende de usuarios, por eso se crea después.
-- ------------------------------------------------------------
CREATE TABLE proyectos (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  descripcion      TEXT,                                 -- TEXT porque puede ser larga. Sin NOT NULL: es opcional
  fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- si no se envía, pone la fecha y hora actual
  administrador_id INTEGER NOT NULL,                     -- todo proyecto debe tener un responsable

  -- ON DELETE CASCADE: si se elimina el administrador, sus proyectos
  -- también se eliminan, porque un proyecto no puede quedar sin responsable.
  FOREIGN KEY (administrador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);


-- ------------------------------------------------------------
-- TABLA 6: usuarios_proyectos
-- Tabla intermedia: registra qué usuarios participan en qué proyectos.
-- Es de muchos a muchos: un usuario participa en varios proyectos
-- y un proyecto tiene varios usuarios.
-- ------------------------------------------------------------
CREATE TABLE usuarios_proyectos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL,
  proyecto_id INTEGER NOT NULL,

  FOREIGN KEY (usuario_id)  REFERENCES usuarios(id)  ON DELETE CASCADE,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,

  -- Un usuario no puede quedar registrado dos veces en el mismo proyecto
  UNIQUE (usuario_id, proyecto_id)
);


-- ------------------------------------------------------------
-- VERIFICACIÓN: muestra que las 6 tablas quedaron creadas
-- ------------------------------------------------------------
SELECT table_name AS tabla
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
