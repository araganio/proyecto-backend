-- ============================================================
-- SCRIPT 3 DE 3: CONSULTAS DE PRUEBA Y VERIFICACIÓN
-- Base de datos: bd_proyecto  (PostgreSQL)
-- Juan Felipe Londoño Marín - Programación Web TS5C4 - UTP
-- ============================================================
--
-- Estas consultas demuestran que las tablas, los datos y las
-- relaciones funcionan correctamente. Se ejecuta cada bloque por
-- separado (seleccionándolo y presionando Ctrl + Enter en DBeaver).
-- ============================================================


-- ------------------------------------------------------------
-- PRUEBA 1: Ver el contenido de cada tabla
-- ------------------------------------------------------------
SELECT * FROM roles;
SELECT * FROM permisos;
SELECT * FROM roles_permisos;
SELECT * FROM usuarios;
SELECT * FROM proyectos;
SELECT * FROM usuarios_proyectos;


-- ------------------------------------------------------------
-- PRUEBA 2: Cuántos registros tiene cada tabla
-- ------------------------------------------------------------
SELECT 'roles' AS tabla, COUNT(*) AS registros FROM roles
UNION ALL SELECT 'permisos',           COUNT(*) FROM permisos
UNION ALL SELECT 'roles_permisos',     COUNT(*) FROM roles_permisos
UNION ALL SELECT 'usuarios',           COUNT(*) FROM usuarios
UNION ALL SELECT 'proyectos',          COUNT(*) FROM proyectos
UNION ALL SELECT 'usuarios_proyectos', COUNT(*) FROM usuarios_proyectos;


-- ------------------------------------------------------------
-- PRUEBA 3: RELACIÓN roles -> usuarios
-- Cada usuario con el nombre de su rol.
-- El JOIN une las dos tablas usando la clave foránea rol_id.
-- ------------------------------------------------------------
SELECT u.id, u.nombre, u.email, r.nombre AS rol
FROM usuarios u
JOIN roles r ON r.id = u.rol_id
ORDER BY u.id;


-- ------------------------------------------------------------
-- PRUEBA 4: RELACIÓN AUTORREFERENCIADA usuarios -> usuarios
-- Cada usuario con el nombre de su administrador responsable.
-- Se usa LEFT JOIN porque los administradores no tienen
-- administrador y se mostrarían como NULL.
-- La tabla usuarios aparece dos veces con alias distintos (u y a)
-- porque se está relacionando consigo misma.
-- ------------------------------------------------------------
SELECT u.nombre AS usuario,
       r.nombre AS rol,
       a.nombre AS administrador_responsable
FROM usuarios u
JOIN roles r      ON r.id = u.rol_id
LEFT JOIN usuarios a ON a.id = u.administrador_id
ORDER BY u.id;


-- ------------------------------------------------------------
-- PRUEBA 5: RELACIÓN roles <-> permisos
-- Qué puede hacer cada rol. Pasa por la tabla intermedia.
-- ------------------------------------------------------------
SELECT r.nombre AS rol, p.nombre AS permiso
FROM roles_permisos rp
JOIN roles r    ON r.id = rp.rol_id
JOIN permisos p ON p.id = rp.permiso_id
ORDER BY r.id, p.id;


-- ------------------------------------------------------------
-- PRUEBA 6: RELACIÓN proyectos -> administrador
-- Cada proyecto con su responsable.
-- ------------------------------------------------------------
SELECT p.id, p.nombre AS proyecto, p.fecha_creacion, u.nombre AS administrador
FROM proyectos p
JOIN usuarios u ON u.id = p.administrador_id
ORDER BY p.id;


-- ------------------------------------------------------------
-- PRUEBA 7: RELACIÓN MUCHOS A MUCHOS usuarios <-> proyectos
-- Qué usuario participa en qué proyecto.
-- Se necesitan dos JOIN porque hay que pasar por la tabla intermedia.
-- ------------------------------------------------------------
SELECT u.nombre AS usuario, p.nombre AS proyecto
FROM usuarios_proyectos up
JOIN usuarios  u ON u.id = up.usuario_id
JOIN proyectos p ON p.id = up.proyecto_id
ORDER BY p.id, u.id;


-- ------------------------------------------------------------
-- PRUEBA 8: Cuántos participantes tiene cada proyecto
-- ------------------------------------------------------------
SELECT p.nombre AS proyecto, COUNT(up.usuario_id) AS participantes
FROM proyectos p
LEFT JOIN usuarios_proyectos up ON up.proyecto_id = p.id
GROUP BY p.id, p.nombre
ORDER BY p.id;


-- ------------------------------------------------------------
-- PRUEBA 9: En cuántos proyectos participa cada usuario
-- (demuestra que un usuario puede estar en varios proyectos)
-- ------------------------------------------------------------
SELECT u.nombre AS usuario, COUNT(up.proyecto_id) AS proyectos
FROM usuarios u
LEFT JOIN usuarios_proyectos up ON up.usuario_id = u.id
WHERE u.rol_id = 2
GROUP BY u.id, u.nombre
ORDER BY u.id;


-- ------------------------------------------------------------
-- PRUEBA 10: Vista completa del sistema
-- Une casi todas las tablas en una sola consulta.
-- ------------------------------------------------------------
SELECT u.nombre       AS usuario,
       r.nombre       AS rol,
       a.nombre       AS su_administrador,
       p.nombre       AS proyecto,
       adm.nombre     AS responsable_del_proyecto
FROM usuarios u
JOIN roles r            ON r.id = u.rol_id
LEFT JOIN usuarios a    ON a.id = u.administrador_id
LEFT JOIN usuarios_proyectos up ON up.usuario_id = u.id
LEFT JOIN proyectos p   ON p.id = up.proyecto_id
LEFT JOIN usuarios adm  ON adm.id = p.administrador_id
ORDER BY u.id, p.id;


-- ============================================================
-- PRUEBAS DE LAS RESTRICCIONES
-- Estas consultas DEBEN fallar. Sirven para demostrar que las
-- reglas de la base de datos están funcionando.
-- Ejecutar una por una para ver el mensaje de error.
-- ============================================================

-- PRUEBA A: email repetido -> ERROR de restricción UNIQUE
-- INSERT INTO usuarios (nombre, email, password, rol_id)
-- VALUES ('Otro Juan', 'juan@ejemplo.com', 'x', 2);

-- PRUEBA B: rol que no existe -> ERROR de clave foránea
-- INSERT INTO usuarios (nombre, email, password, rol_id)
-- VALUES ('Prueba', 'prueba@ejemplo.com', 'x', 99);

-- PRUEBA C: participación duplicada -> ERROR de restricción UNIQUE
-- INSERT INTO usuarios_proyectos (usuario_id, proyecto_id) VALUES (3, 1);

-- PRUEBA D: proyecto sin administrador -> ERROR de NOT NULL
-- INSERT INTO proyectos (nombre) VALUES ('Proyecto sin responsable');
