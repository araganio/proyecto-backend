// Servicio de proyectos: lógica de negocio de la entidad "proyectos".
//
// Reglas del documento de lógica de negocio:
//  - Cada proyecto debe tener un administrador responsable.
//  - Ser administrador de un proyecto es DIFERENTE de participar en él.
//  - Un usuario puede participar en varios proyectos y un proyecto tener varios usuarios.
//  - La combinación usuario_id + proyecto_id no se puede repetir.
//
// Varias funciones reciben el id del usuario que viene del token para
// verificar que solo el administrador responsable pueda modificar su proyecto.
const Proyecto = require('../models/proyecto.model');
const Usuario = require('../models/usuario.model');
const UsuarioProyecto = require('../models/usuario_proyecto.model');
const { ROLES } = require('../utils/constants');

// En las respuestas se incluye el administrador y los participantes
const incluirRelaciones = [
  { model: Usuario, as: 'administrador', attributes: ['id', 'nombre', 'email'] },
  { model: Usuario, as: 'usuarios', attributes: ['id', 'nombre', 'email'], through: { attributes: [] } },
];

exports.createProject = async (data) => {
  try {
    const { nombre, descripcion, administrador_id } = data;

    if (!nombre || !administrador_id) {
      throw new Error('nombre y administrador_id son obligatorios');
    }

    const newProject = await Proyecto.create({ nombre, descripcion, administrador_id });
    return Proyecto.findByPk(newProject.id, { include: incluirRelaciones });
  } catch (err) {
    throw new Error(`Error al crear el proyecto: ${err.message}`);
  }
};

// Todos los proyectos del sistema
exports.getAllProjects = async () => Proyecto.findAll({
  include: incluirRelaciones,
  order: [['id', 'ASC']],
});

// Proyectos de un usuario: si es administrador devuelve los que administra,
// si es usuario regular devuelve aquellos en los que participa.
exports.getProjectsByUserId = async (userId) => {
  const user = await Usuario.findByPk(userId);
  if (!user) return [];

  if (user.rol_id === ROLES.ADMIN) {
    return Proyecto.findAll({
      where: { administrador_id: userId },
      include: incluirRelaciones,
      order: [['id', 'ASC']],
    });
  }

  // Usuario regular: solo los proyectos en los que participa
  return Proyecto.findAll({
    include: [
      { model: Usuario, as: 'usuarios', attributes: [], where: { id: userId } },
      { model: Usuario, as: 'administrador', attributes: ['id', 'nombre', 'email'] },
    ],
    order: [['id', 'ASC']],
  });
};

// Un proyecto por id. Recibe el userId para verificar que tenga acceso:
// debe ser el administrador responsable o participar en el proyecto.
exports.getProjectById = async (id, userId) => {
  const project = await Proyecto.findByPk(id, { include: incluirRelaciones });
  if (!project) return null;

  const esAdministrador = project.administrador_id === Number(userId);
  const participa = project.usuarios.some((u) => u.id === Number(userId));

  if (!esAdministrador && !participa) {
    throw new Error('No tienes acceso a este proyecto');
  }

  return project;
};

// Asigna VARIOS usuarios a un proyecto de una sola vez.
// data: { proyecto_id, usuarios_ids: [1, 2, 3], admin_from_token }
exports.assignUsersToProject = async (data) => {
  const { proyecto_id, usuarios_ids, admin_from_token } = data;

  const project = await Proyecto.findByPk(proyecto_id);
  if (!project) return null;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes asignar usuarios a un proyecto que no te pertenece');
  }

  if (!Array.isArray(usuarios_ids) || usuarios_ids.length === 0) {
    throw new Error('usuarios_ids debe ser una lista con al menos un usuario');
  }

  for (const usuario_id of usuarios_ids) {
    const usuario = await Usuario.findByPk(usuario_id);
    if (!usuario) {
      throw new Error(`El usuario con id ${usuario_id} no existe`);
    }

    // No duplicar la participación
    const yaParticipa = await UsuarioProyecto.findOne({ where: { proyecto_id, usuario_id } });
    if (!yaParticipa) {
      await UsuarioProyecto.create({ proyecto_id, usuario_id });
    }
  }

  return Proyecto.findByPk(proyecto_id, { include: incluirRelaciones });
};

// data: { proyecto_id, usuario_id, admin_from_token }
exports.removeUserFromProject = async (data) => {
  const { proyecto_id, usuario_id, admin_from_token } = data;

  const project = await Proyecto.findByPk(proyecto_id);
  if (!project) return false;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes quitar usuarios de un proyecto que no te pertenece');
  }

  const filas = await UsuarioProyecto.destroy({ where: { proyecto_id, usuario_id } });
  return filas > 0;
};

// data: { id, nombre, descripcion, admin_from_token }
exports.updateProject = async (data) => {
  const { id, nombre, descripcion, admin_from_token } = data;

  const project = await Proyecto.findByPk(id);
  if (!project) return null;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes modificar un proyecto que no te pertenece');
  }

  await project.update({
    nombre: nombre ?? project.nombre,
    descripcion: descripcion ?? project.descripcion,
  });

  return Proyecto.findByPk(id, { include: incluirRelaciones });
};

exports.deleteProject = async (id, admin_from_token) => {
  const project = await Proyecto.findByPk(id);
  if (!project) return false;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes eliminar un proyecto que no te pertenece');
  }

  await project.destroy();
  return true;
};
