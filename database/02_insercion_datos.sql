-- ============================================================
-- SCRIPT 2 DE 3: INSERCIÓN DE LOS REGISTROS DE PRUEBA
-- Base de datos: bd_proyecto  (PostgreSQL)
-- Juan Felipe Londoño Marín - Programación Web TS5C4 - UTP
-- ============================================================
--
-- Se ejecuta DESPUÉS de 01_creacion_tablas.sql
-- El orden también importa: no se puede insertar un usuario con un
-- rol_id que todavía no existe en la tabla roles.
-- ============================================================


-- ------------------------------------------------------------
-- DATOS 1: roles
-- Los dos niveles de acceso del sistema.
-- ------------------------------------------------------------
INSERT INTO roles (nombre) VALUES
  ('Administrador'),   -- id 1
  ('Usuario');         -- id 2

SELECT * FROM roles;


-- ------------------------------------------------------------
-- DATOS 2: permisos
-- Las acciones disponibles en el sistema.
-- ------------------------------------------------------------
INSERT INTO permisos (nombre) VALUES
  ('crear'),        -- id 1
  ('visualizar'),   -- id 2
  ('actualizar'),   -- id 3
  ('eliminar');     -- id 4

SELECT * FROM permisos;


-- ------------------------------------------------------------
-- DATOS 3: roles_permisos
-- El Administrador (rol 1) puede hacer las cuatro acciones.
-- El Usuario regular (rol 2) solamente puede visualizar.
-- ------------------------------------------------------------
INSERT INTO roles_permisos (rol_id, permiso_id) VALUES
  (1, 1),   -- Administrador -> crear
  (1, 2),   -- Administrador -> visualizar
  (1, 3),   -- Administrador -> actualizar
  (1, 4),   -- Administrador -> eliminar
  (2, 2);   -- Usuario       -> visualizar

SELECT * FROM roles_permisos;


-- ------------------------------------------------------------
-- DATOS 4: usuarios
--
-- Las contraseñas se guardan HASHEADAS con bcrypt (nunca en texto
-- plano). El backend las hashea antes de insertarlas; aquí se ponen
-- los hashes ya generados para poder probar el inicio de sesión.
--
-- Contraseñas reales para las pruebas:
--   juan@ejemplo.com     -> admin123
--   carolina@ejemplo.com -> carol123
--   ana@ejemplo.com      -> ana123
--   camilo@ejemplo.com   -> camilo123
--   laura@ejemplo.com    -> laura123
--   santiago@ejemplo.com -> santi123
--
-- Primero los dos administradores (administrador_id en NULL porque
-- ellos no tienen un administrador por encima), y después los
-- usuarios regulares, que sí apuntan a su administrador.
-- ------------------------------------------------------------
INSERT INTO usuarios (nombre, email, password, rol_id, administrador_id) VALUES
  ('Juan Felipe Londoño', 'juan@ejemplo.com',     '$2b$10$AMwBAcJw7kDAJRcH673tN.lXcYOj8nX.SwnB8P6g9TWz01jK9qR2C', 1, NULL),
  ('Carolina Ramírez',    'carolina@ejemplo.com', '$2b$10$xVxkm.oyx18D83jdq/5kvOO8YDaSnLcGdYmhAkHvsTEd99PIsBVBu', 1, NULL);

INSERT INTO usuarios (nombre, email, password, rol_id, administrador_id) VALUES
  ('Ana Gómez',       'ana@ejemplo.com',      '$2b$10$1tJKZqfoYOmUT3mqBLwtJODXVhu/PTCJfSFRjSEqxojO6c8oxOzxi', 2, 1),
  ('Camilo Delgado',  'camilo@ejemplo.com',   '$2b$10$6JzFfy0JpsEGH8/u.2EBlug3uiutCzPPEhfVPINQG3czLCbP50AdO', 2, 1),
  ('Laura Martínez',  'laura@ejemplo.com',    '$2b$10$EQ87ykMk9CCoKSwaFiMVseNOiVmt0b8pbSXFItB6IAdhuISgxScO.', 2, 2),
  ('Santiago Ruiz',   'santiago@ejemplo.com', '$2b$10$2xjqVnztMXzfirQFVQjoROMdxSwn5P5qi7v7z7lHkDmofd1vOrjO6', 2, 2);

SELECT id, nombre, email, rol_id, administrador_id FROM usuarios ORDER BY id;


-- ------------------------------------------------------------
-- DATOS 5: proyectos
-- Cada proyecto tiene un administrador responsable.
-- No se envía fecha_creacion: PostgreSQL pone la fecha y hora actual.
-- ------------------------------------------------------------
INSERT INTO proyectos (nombre, descripcion, administrador_id) VALUES
  ('Sistema de Reservas ReserVibe', 'Aplicación para reservar mesas en restaurantes', 1),
  ('Portafolio de Servicios Web',   'Sitio web institucional en HTML y CSS',          1),
  ('Plataforma de Inventario',      'Control de entradas y salidas de productos',     2);

SELECT * FROM proyectos ORDER BY id;


-- ------------------------------------------------------------
-- DATOS 6: usuarios_proyectos
-- Participación de los usuarios en los proyectos.
-- Aquí se ve la relación de muchos a muchos:
--   Ana (3) participa en dos proyectos: el 1 y el 2
--   El proyecto 1 tiene dos participantes: Ana (3) y Camilo (4)
-- ------------------------------------------------------------
INSERT INTO usuarios_proyectos (usuario_id, proyecto_id) VALUES
  (3, 1),   -- Ana      -> ReserVibe
  (3, 2),   -- Ana      -> Portafolio de Servicios
  (4, 1),   -- Camilo   -> ReserVibe
  (5, 3),   -- Laura    -> Plataforma de Inventario
  (6, 3);   -- Santiago -> Plataforma de Inventario

SELECT * FROM usuarios_proyectos ORDER BY id;
