// Servicio de proyectos: lógica de negocio de la entidad "proyectos".
//
// Reglas del documento de lógica de negocio:
//  - Cada proyecto debe tener un administrador responsable.
//  - Ser administrador de un proyecto es DIFERENTE de participar en él.
//  - Un usuario puede participar en varios proyectos y un proyecto tener varios usuarios.
//  - La combinación usuario_id + proyecto_id no se puede repetir.
const { Op } = require('sequelize');
const Proyecto = require('../models/proyecto.model');
const Usuario = require('../models/usuario.model');
const UsuarioProyecto = require('../models/usuario_proyecto.model');

// En las respuestas se incluye el administrador responsable y los participantes
const incluirRelaciones = [
  { model: Usuario, as: 'administrador', attributes: ['id', 'nombre', 'email'] },
  { model: Usuario, as: 'usuarios', attributes: ['id', 'nombre', 'email'], through: { attributes: [] } },
];

exports.createProject = async (nombre, descripcion, administrador_id) => {
  try {
    if (!nombre || !administrador_id) {
      throw new Error('nombre y administrador_id son obligatorios');
    }

    const newProject = await Proyecto.create({ nombre, descripcion, administrador_id });
    return Proyecto.findByPk(newProject.id, { include: incluirRelaciones });
  } catch (err) {
    throw new Error(`Error al crear el proyecto: ${err.message}`);
  }
};

exports.getAllProjectsByAdministradorId = async (administrador_id, nombre) => {
  const where = { administrador_id };

  // Filtro opcional por nombre
  if (nombre) {
    where.nombre = { [Op.iLike]: `%${nombre}%` };
  }

  return Proyecto.findAll({ where, include: incluirRelaciones, order: [['id', 'ASC']] });
};

exports.getProjectById = async (id) => Proyecto.findByPk(id, { include: incluirRelaciones });

// Proyectos en los que PARTICIPA un usuario (distinto de los que administra)
exports.getAllProjectsByUsuarioId = async (usuario_id) => Proyecto.findAll({
  include: [
    { model: Usuario, as: 'usuarios', attributes: [], where: { id: usuario_id } },
    { model: Usuario, as: 'administrador', attributes: ['id', 'nombre', 'email'] },
  ],
  order: [['id', 'ASC']],
});

exports.updateProject = async (id, nombre, descripcion, admin_from_token) => {
  const project = await Proyecto.findByPk(id);
  if (!project) return null;

  // Solo el administrador responsable puede modificarlo
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

// --- Participación de usuarios en proyectos ---

exports.addUserToProject = async (proyecto_id, usuario_id, admin_from_token) => {
  const project = await Proyecto.findByPk(proyecto_id);
  if (!project) return null;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes asignar usuarios a un proyecto que no te pertenece');
  }

  const usuario = await Usuario.findByPk(usuario_id);
  if (!usuario) {
    throw new Error('El usuario no existe');
  }

  // No duplicar participación
  const yaParticipa = await UsuarioProyecto.findOne({ where: { proyecto_id, usuario_id } });
  if (yaParticipa) {
    throw new Error('El usuario ya participa en este proyecto');
  }

  await UsuarioProyecto.create({ proyecto_id, usuario_id });
  return Proyecto.findByPk(proyecto_id, { include: incluirRelaciones });
};

exports.removeUserFromProject = async (proyecto_id, usuario_id, admin_from_token) => {
  const project = await Proyecto.findByPk(proyecto_id);
  if (!project) return false;

  if (project.administrador_id !== admin_from_token) {
    throw new Error('No puedes quitar usuarios de un proyecto que no te pertenece');
  }

  const filas = await UsuarioProyecto.destroy({ where: { proyecto_id, usuario_id } });
  return filas > 0;
};
