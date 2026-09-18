// Servicio de usuarios: lógica de negocio (validaciones, reglas).
// El controlador llama al servicio, y el servicio usa los modelos (Sequelize)
// para hablar con PostgreSQL.
const bcrypt = require('bcryptjs');
const { Usuario, Rol } = require('../models');

// Cada consulta incluye el rol para que la respuesta sea más útil
const incluirRol = { include: [{ model: Rol, as: 'rol', attributes: ['id', 'nombre'] }] };

const getAll = () => Usuario.findAll({ ...incluirRol, order: [['id', 'ASC']] });

const getById = (id) => Usuario.findByPk(id, incluirRol);

const create = async ({ nombre, email, password, rol_id, administrador_id }) => {
  if (!nombre || !email || !password || !rol_id) {
    throw new Error('nombre, email, password y rol_id son obligatorios');
  }

  // Nunca guardamos la contraseña en texto plano: se hashea antes de insertar
  const passwordHash = await bcrypt.hash(password, 10);

  const usuario = await Usuario.create({
    nombre,
    email,
    password: passwordHash,
    rol_id,
    administrador_id: administrador_id || null,
  });

  return getById(usuario.id);
};

const update = async (id, data) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) return null;

  // Si cambian la contraseña, también se hashea
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  await usuario.update(data);
  return getById(id);
};

const remove = async (id) => {
  const filas = await Usuario.destroy({ where: { id } });
  return filas > 0;
};

module.exports = { getAll, getById, create, update, remove };
