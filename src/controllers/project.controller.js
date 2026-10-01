// Controlador de proyectos: recibe la petición (req), llama al servicio y responde (res).
const ProjectService = require('../services/project.service');

// GET /api/proyectos  -> si es administrador, los que administra;
//                        si es usuario regular, en los que participa
const getProjects = async (req, res, next) => {
  try {
    res.status(200).json(await ProjectService.getProjectsByUserId(req.usuario.id));
  } catch (error) {
    next(error);
  }
};

// GET /api/proyectos/todos  -> todos los proyectos del sistema
const getAllProjects = async (req, res, next) => {
  try {
    res.status(200).json(await ProjectService.getAllProjects());
  } catch (error) {
    next(error);
  }
};

// GET /api/proyectos/:id
const getProject = async (req, res, next) => {
  try {
    const proyecto = await ProjectService.getProjectById(req.params.id, req.usuario.id);
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(200).json(proyecto);
  } catch (error) {
    if (error.message.includes('No tienes acceso')) {
      return res.status(403).json({ message: error.message });
    }
    next(error);
  }
};

// POST /api/proyectos
const createProject = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body;

    // El administrador responsable es siempre el del token
    const proyecto = await ProjectService.createProject({
      nombre,
      descripcion,
      administrador_id: req.usuario.id,
    });

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
    const proyecto = await ProjectService.updateProject({
      id: req.params.id,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      admin_from_token: req.usuario.id,
    });

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

// POST /api/proyectos/:id/usuarios   body: { usuarios_ids: [1, 2, 3] }
// Permite asignar varios usuarios de una sola vez.
const assignUsers = async (req, res, next) => {
  try {
    const proyecto = await ProjectService.assignUsersToProject({
      proyecto_id: req.params.id,
      usuarios_ids: req.body.usuarios_ids,
      admin_from_token: req.usuario.id,
    });

    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.status(201).json(proyecto);
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message.includes('no existe') || error.message.includes('usuarios_ids')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// DELETE /api/proyectos/:id/usuarios/:usuario_id
const removeUser = async (req, res, next) => {
  try {
    const ok = await ProjectService.removeUserFromProject({
      proyecto_id: req.params.id,
      usuario_id: req.params.usuario_id,
      admin_from_token: req.usuario.id,
    });

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
  getProjects, getAllProjects, getProject,
  createProject, updateProject, deleteProject,
  assignUsers, removeUser,
};
