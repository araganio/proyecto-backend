// Asociaciones (relaciones) entre los modelos.
// Aquí se traduce a Sequelize lo que en la base de datos son las claves foráneas.
const Rol = require('./rol.model');
const Usuario = require('./usuario.model');
const Proyecto = require('./proyecto.model');
const UsuarioProyecto = require('./usuario_proyecto.model');
const Permiso = require('./permiso.model');
const RolPermiso = require('./rol_permiso.model');

// --- Rol <-> Usuario (uno a muchos) ---
// Un rol tiene muchos usuarios / un usuario pertenece a un rol
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

// --- Usuario <-> Usuario (autorreferenciada) ---
// Un usuario pertenece a un administrador, que también es un usuario
Usuario.belongsTo(Usuario, { foreignKey: 'administrador_id', as: 'administrador' });
Usuario.hasMany(Usuario, { foreignKey: 'administrador_id', as: 'usuarios_a_cargo' });

// --- Usuario <-> Proyecto (uno a muchos) ---
// Cada proyecto tiene un administrador responsable
Usuario.hasMany(Proyecto, { foreignKey: 'administrador_id', as: 'proyectos_administrados' });
Proyecto.belongsTo(Usuario, { foreignKey: 'administrador_id', as: 'administrador' });

// --- Usuario <-> Proyecto (muchos a muchos) ---
// A través de la tabla intermedia usuarios_proyectos
Usuario.belongsToMany(Proyecto, {
  through: UsuarioProyecto, foreignKey: 'usuario_id', otherKey: 'proyecto_id', as: 'proyectos',
});
Proyecto.belongsToMany(Usuario, {
  through: UsuarioProyecto, foreignKey: 'proyecto_id', otherKey: 'usuario_id', as: 'usuarios',
});

// --- Rol <-> Permiso (muchos a muchos) ---
// A través de la tabla intermedia roles_permisos
Rol.belongsToMany(Permiso, {
  through: RolPermiso, foreignKey: 'rol_id', otherKey: 'permiso_id', as: 'permisos',
});
Permiso.belongsToMany(Rol, {
  through: RolPermiso, foreignKey: 'permiso_id', otherKey: 'rol_id', as: 'roles',
});

module.exports = { Rol, Usuario, Proyecto, UsuarioProyecto, Permiso, RolPermiso };
