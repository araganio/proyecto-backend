// Servicio de usuarios: lógica de negocio (validaciones y reglas).
// El controlador llama al servicio, y el servicio usa los modelos (Sequelize)
// para hablar con PostgreSQL.
//
// Regla importante del proyecto: un administrador solo puede ver y modificar
// SUS usuarios. Por eso varias funciones reciben "admin_from_token", que es
// el id del administrador que viene dentro del token JWT.
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const Rol = require('../models/rol.model');

// Se incluye el rol en las respuestas para que sean más útiles
const incluirRol = [{ model: Rol, as: 'rol', attributes: ['id', 'nombre'] }];

exports.createUser = async (nombre, email, password, rol_id, administrador_id) => {
  if (!nombre || !email || !password || !rol_id) {
    throw new Error('nombre, email, password y rol_id son obligatorios');
  }

  // Nunca se guarda la contraseña en texto plano: se hashea antes de insertar
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await Usuario.create({
    nombre,
    email,
    password: passwordHash,
    rol_id,
    administrador_id: administrador_id || null,
  });

  return Usuario.findByPk(user.id, { include: incluirRol });
};

exports.updateUser = async (id, nombre, email, rol_id, administrador_id, admin_from_token) => {
  const user = await Usuario.findByPk(id);
  if (!user) return null;

  // Solo el administrador dueño puede modificarlo
  if (user.administrador_id !== admin_from_token) {
    throw new Error('No puedes modificar un usuario que no te pertenece');
  }

  await user.update({
    nombre: nombre ?? user.nombre,
    email: email ?? user.email,
    rol_id: rol_id ?? user.rol_id,
    administrador_id: administrador_id ?? user.administrador_id,
  });

  return Usuario.findByPk(id, { include: incluirRol });
};

exports.getAllUsersByAdministradorId = async (administrador_id, email) => {
  const where = { administrador_id };

  // El email es un filtro opcional: si llega, busca coincidencias parciales
  if (email) {
    where.email = { [Op.iLike]: `%${email}%` };
  }

  return Usuario.findAll({ where, include: incluirRol, order: [['id', 'ASC']] });
};

exports.deleteUser = async (id, admin_from_token) => {
  const user = await Usuario.findByPk(id);
  if (!user) return false;

  // Solo el administrador dueño puede eliminarlo
  if (user.administrador_id !== admin_from_token) {
    throw new Error('No puedes eliminar un usuario que no te pertenece');
  }

  await user.destroy();
  return true;
};

exports.getAllUsersByRolId = async (rol_id) => Usuario.findAll({
  where: { rol_id },
  include: incluirRol,
  order: [['id', 'ASC']],
});

// Un usuario por id (se usa en GET /api/usuarios/:id)
exports.getUserById = async (id) => Usuario.findByPk(id, { include: incluirRol });
