// Punto central de los modelos: los importa y define las relaciones entre tablas
// (equivalente a las claves foráneas del script SQL).
const Rol = require('./rol.model');
const Usuario = require('./usuario.model');
const Proyecto = require('./proyecto.model');
const UsuarioProyecto = require('./usuario_proyecto.model');

// Un rol tiene muchos usuarios / un usuario pertenece a un rol
Rol.hasMany(Usuario, { foreignKey: 'rol_id', as: 'usuarios' });
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', as: 'rol' });

// Un usuario pertenece a un administrador (que también es un usuario)
Usuario.belongsTo(Usuario, { foreignKey: 'administrador_id', as: 'administrador' });

// Un proyecto pertenece a un administrador
Usuario.hasMany(Proyecto, { foreignKey: 'administrador_id', as: 'proyectos_administrados' });
Proyecto.belongsTo(Usuario, { foreignKey: 'administrador_id', as: 'administrador' });

// Muchos a muchos: usuarios <-> proyectos a través de usuarios_proyectos
Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto, foreignKey: 'usuario_id', otherKey: 'proyecto_id', as: 'proyectos' });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto, foreignKey: 'proyecto_id', otherKey: 'usuario_id', as: 'usuarios' });

module.exports = { Rol, Usuario, Proyecto, UsuarioProyecto };
