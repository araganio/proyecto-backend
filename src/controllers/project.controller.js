// Controlador de proyectos: recibe la petición (req), llama al servicio y responde (res).
const ProjectService = require('../services/project.service');

// GET /api/proyectos?nombre=algo  -> proyectos que administra el usuario del token
const getProjects = async (req, res, next) => {
  try {
    const { nombre } = req.query;
    res.status(200).json(
      await ProjectService.getAllProjectsByAdministradorId(req.usuario.id, nombre),
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/proyectos/mis-participaciones -> proyectos en los que PARTICIPA
const getMyParticipations = async (req, res, next) => {
  try {
    res.status(200).json(await ProjectService.getAllProjectsByUsuarioId(req.usuario.id));
  } catch (error) {
    next(error);
  }
};

// GET /api/proyectos/:id
const getProject = async (req, res, next) => {
  try {
    const proyecto = await ProjectService.getProjectById(req.params.id);
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(200).json(proyecto);
  } catch (error) {
    next(error);
  }
};

// POST /api/proyectos
const createProject = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    // El administrador responsable es siempre el del token
    const proyecto = await ProjectService.createProject(nombre, descripcion, req.usuario.id);
    res.status(201).json(proyecto);
  } catch (error) {
    if (error.message.includes('obligatorios')) {
      return res.status(400).json({ message: 'nombre y administrador_id son obligatorios' });
    }
    next(error);
  }
};

// PUT /api/proyectos/:id
const updateProject = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;
    const proyecto = await ProjectService.updateProject(
      req.params.id, nombre, descripcion, req.usuario.id,
    );
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(200).json(proyecto);
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

// DELETE /api/proyectos/:id
const deleteProject = async (req, res, next) => {
  try {
    const ok = await ProjectService.deleteProject(req.params.id, req.usuario.id);
    if (!ok) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

// POST /api/proyectos/:id/usuarios   body: { usuario_id }
const addUser = async (req, res, next) => {
  try {
    const proyecto = await ProjectService.addUserToProject(
      req.params.id, req.body.usuario_id, req.usuario.id,
    );
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(201).json(proyecto);
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('ya participa') || error.message.includes('no existe')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// DELETE /api/proyectos/:id/usuarios/:usuario_id
const removeUser = async (req, res, next) => {
  try {
    const ok = await ProjectService.removeUserFromProject(
      req.params.id, req.params.usuario_id, req.usuario.id,
    );
    if (!ok) return res.status(404).json({ message: 'El usuario no participa en ese proyecto' });
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  getProjects, getMyParticipations, getProject,
  createProject, updateProject, deleteProject,
  addUser, removeUser,
};
