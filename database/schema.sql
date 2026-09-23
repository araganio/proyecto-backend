-- =============================================
-- BASE DE DATOS: Plataforma de gestión de usuarios y proyectos
-- Curso: Programación Web - UTP (clases 05 y 06)
-- Ejecutar en DBeaver sobre la base de datos "bd_proyecto"
-- (antes: CREATE DATABASE bd_proyecto;  desde la conexión a "postgres")
--
-- IMPORTANTE: ejecutar bloque por bloque, en este orden.
-- Primero las tablas referenciadas y después las que dependen de ellas.
-- =============================================

-- ---------- 1. ROLES ----------
CREATE TABLE roles (
  id     SERIAL PRIMARY KEY,           -- serial = identificador autoincremental
  nombre VARCHAR(50) NOT NULL UNIQUE   -- obligatorio y sin repetir
);

INSERT INTO roles (nombre) VALUES ('Administrador'), ('Usuario');

-- ---------- 2. USUARIOS ----------
CREATE TABLE usuarios (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,   -- se guarda hasheada (bcrypt, en el backend)
  rol_id           INTEGER NOT NULL,
  administrador_id INTEGER,                 -- puede ser NULL: un admin no tiene admin

  -- Clave foránea hacia roles
  FOREIGN KEY (rol_id) REFERENCES roles(id),

  -- Clave foránea AUTORREFERENCIADA: la tabla se relaciona consigo misma.
  -- ON DELETE SET NULL: si se elimina el administrador, sus usuarios NO se borran,
  -- simplemente quedan sin administrador asignado.
  FOREIGN KEY (administrador_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ---------- 3. PROYECTOS ----------
CREATE TABLE proyectos (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  descripcion      TEXT,                                    -- opcional (sin NOT NULL)
  fecha_creacion   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,     -- fecha y hora automáticas
  administrador_id INTEGER NOT NULL,

  -- ON DELETE CASCADE: si se elimina el administrador, sus proyectos también se eliminan.
  FOREIGN KEY (administrador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ---------- 4. USUARIOS_PROYECTOS (tabla intermedia, muchos a muchos) ----------
CREATE TABLE usuarios_proyectos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL,
  proyecto_id INTEGER NOT NULL,

  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE,

  -- La combinación usuario + proyecto debe ser única (no duplicar la relación)
  UNIQUE (usuario_id, proyecto_id)
);

-- ---------- 5. PERMISOS ----------
CREATE TABLE permisos (
  id     SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO permisos (nombre) VALUES ('crear'), ('visualizar'), ('actualizar'), ('eliminar');

-- ---------- 6. ROLES_PERMISOS (qué puede hacer cada rol) ----------
CREATE TABLE roles_permisos (
  id         SERIAL PRIMARY KEY,
  rol_id     INTEGER NOT NULL,
  permiso_id INTEGER NOT NULL,

  FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE,

  UNIQUE (rol_id, permiso_id)
);

-- El Administrador (rol 1) tiene los cuatro permisos.
-- El Usuario regular (rol 2) solo puede visualizar.
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
  (1, 1),  -- administrador -> crear
  (1, 2),  -- administrador -> visualizar
  (1, 3),  -- administrador -> actualizar
  (1, 4),  -- administrador -> eliminar
  (2, 2);  -- usuario       -> visualizar

-- =============================================
-- CONSULTAS DE VERIFICACIÓN
-- =============================================
SELECT * FROM roles;
SELECT * FROM usuarios;
SELECT * FROM proyectos;
SELECT * FROM usuarios_proyectos;
SELECT * FROM permisos;
SELECT * FROM roles_permisos;

-- Permisos de cada rol (usando las claves foráneas)
SELECT r.nombre AS rol, p.nombre AS permiso
FROM roles_permisos rp
JOIN roles r    ON r.id = rp.rol_id
JOIN permisos p ON p.id = rp.permiso_id
ORDER BY r.id, p.id;

-- NOTA: a partir de la clase 06 los datos de usuarios y proyectos
-- NO se insertan a mano aquí: se crean desde Postman o el frontend.
