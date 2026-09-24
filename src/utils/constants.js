// Constantes del proyecto.
// Evita escribir números sueltos ("números mágicos") por todo el código:
// en vez de "rol_id: 1" se escribe "ROLES.ADMIN", que se entiende solo.

// Deben coincidir con los ids de la tabla "roles"
const ROLES = {
  ADMIN: 1,
  USER: 2,
};

// Deben coincidir con los ids de la tabla "permisos"
const PERMISOS = {
  CREAR: 1,
  VISUALIZAR: 2,
  ACTUALIZAR: 3,
  ELIMINAR: 4,
};

module.exports = { ROLES, PERMISOS };
