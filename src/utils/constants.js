// Constantes del proyecto.
// Evita escribir números sueltos ("números mágicos") por todo el código:
// en vez de "rol_id: 1" se escribe "rol_id: ROLES.ADMIN", que se entiende solo.

// Deben coincidir con los ids de la tabla "roles" en la base de datos
const ROLES = {
  ADMIN: 1,
  USER: 2,
};

module.exports = ROLES;
