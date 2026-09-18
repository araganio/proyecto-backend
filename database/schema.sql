-- =============================================
-- BASE DE DATOS: Plataforma de gestión de usuarios y proyectos
-- Curso: Programación Web - UTP
-- Ejecutar en DBeaver sobre la base de datos "bd_proyecto"
-- (antes: CREATE DATABASE bd_proyecto;  desde la conexión a "postgres")
-- =============================================

-- Orden: primero las tablas referenciadas, después las que dependen de ellas.

-- ---------- 1. ROLES ----------
CREATE TABLE roles (
  id     SERIAL PRIMARY KEY,           -- identificador único, autoincremental
  nombre VARCHAR(50) NOT NULL UNIQUE   -- obligatorio y no se puede repetir
);

-- ---------- 2. USUARIOS ----------
CREATE TABLE usuarios (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  email            VARCHAR(100) NOT NULL UNIQUE,
  password         VARCHAR(255) NOT NULL,          -- se guarda hasheada (lo hace el backend)
  rol_id           INTEGER NOT NULL REFERENCES roles(id),      -- clave foránea -> roles
  administrador_id INTEGER REFERENCES usuarios(id)             -- clave foránea -> usuarios (su admin)
);

-- ---------- 3. PROYECTOS ----------
CREATE TABLE proyectos (
  id               SERIAL PRIMARY KEY,
  nombre           VARCHAR(100) NOT NULL,
  descripcion      TEXT,
  fecha_creacion   DATE NOT NULL DEFAULT CURRENT_DATE,
  administrador_id INTEGER NOT NULL REFERENCES usuarios(id)    -- clave foránea -> usuarios
);

-- ---------- 4. USUARIOS_PROYECTOS (tabla intermedia, muchos a muchos) ----------
CREATE TABLE usuarios_proyectos (
  id          SERIAL PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id),
  UNIQUE (usuario_id, proyecto_id)   -- un usuario no se asigna dos veces al mismo proyecto
);

-- =============================================
-- DATOS DE PRUEBA (un registro por tabla, como pidió la profe)
-- =============================================

INSERT INTO roles (nombre) VALUES ('administrador'), ('usuario');

-- Un administrador (no tiene administrador_id porque él es el admin)
INSERT INTO usuarios (nombre, email, password, rol_id, administrador_id)
VALUES ('Juan Felipe', 'juan@ejemplo.com', 'hash_temporal', 1, NULL);

-- Un usuario normal que pertenece al administrador con id 1
INSERT INTO usuarios (nombre, email, password, rol_id, administrador_id)
VALUES ('Ana', 'ana@ejemplo.com', 'hash_temporal', 2, 1);

INSERT INTO proyectos (nombre, descripcion, administrador_id)
VALUES ('Portafolio Web', 'Sitio personal en HTML y CSS', 1);

INSERT INTO usuarios_proyectos (usuario_id, proyecto_id) VALUES (2, 1);

-- =============================================
-- CONSULTAS DE VERIFICACIÓN
-- =============================================
SELECT * FROM roles;
SELECT * FROM usuarios;
SELECT * FROM proyectos;
SELECT * FROM usuarios_proyectos;
