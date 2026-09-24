// Controlador de usuarios: recibe la petición (req), llama al servicio y responde (res).
// Códigos de estado HTTP vistos en clase:
//   200 OK · 201 Created · 204 No Content · 400 Bad Request
//   403 Forbidden · 404 Not Found · 500 Server Error
const UserService = require('../services/user.service');

// GET /api/usuarios?email=algo
// Devuelve los usuarios que pertenecen al administrador del token.
const getUsers = async (req, res, next) => {
  try {
    const { email } = req.query;                 // filtro opcional
    const administrador_id = req.usuario.id;     // viene del token
    res.status(200).json(await UserService.getAllUsersByAdministradorId(administrador_id, email));
  } catch (error) {
    next(error); // lo atrapa el manejador de errores de app.js (500)
  }
};

// GET /api/usuarios/rol/:rol_id
const getUsersByRol = async (req, res, next) => {
  try {
    res.status(200).json(await UserService.getAllUsersByRolId(req.params.rol_id));
  } catch (error) {
    next(error);
  }
};

// GET /api/usuarios/:id
const getUser = async (req, res, next) => {
  try {
    const usuario = await UserService.getUserById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

// POST /api/usuarios
const createUser = async (req, res, next) => {
  try {
    const { nombre, email, password, rol_id, administrador_id } = req.body;

    // Si no mandan administrador_id, se asigna el administrador del token
    const usuario = await UserService.createUser(
      nombre, email, password, rol_id, administrador_id || req.usuario.id,
    );

    res.status(201).json(usuario);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'rol_id o administrador_id no existen' });
    }
    if (error.message.includes('obligatorios')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

// PUT /api/usuarios/:id
const updateUser = async (req, res, next) => {
  try {
    const { nombre, email, rol_id, administrador_id } = req.body;

    const usuario = await UserService.updateUser(
      req.params.id, nombre, email, rol_id, administrador_id, req.usuario.id,
    );

    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    // 403 Forbidden: el usuario existe pero no le pertenece a este administrador
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    next(error);
  }
};

// DELETE /api/usuarios/:id
const deleteUser = async (req, res, next) => {
  try {
    const ok = await UserService.deleteUser(req.params.id, req.usuario.id);
    if (!ok) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (error) {
    if (error.message.includes('no te pertenece')) {
      return res.status(403).json({ message: error.message });
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'No se puede eliminar: el usuario tiene registros asociados' });
    }
    next(error);
  }
};

module.exports = { getUsers, getUsersByRol, getUser, createUser, updateUser, deleteUser };
