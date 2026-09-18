// Controlador de usuarios: recibe la petición (req), llama al servicio y responde (res).
// Códigos de estado HTTP vistos en clase:
//   200 OK · 201 Created · 204 No Content · 400 Bad Request · 404 Not Found · 500 Server Error
// Como el servicio habla con la base de datos, las funciones son async y usan try/catch.
const UserService = require('../services/user.service');

// GET /api/usuarios
const getUsers = async (req, res, next) => {
  try {
    res.status(200).json(await UserService.getAll());
  } catch (error) {
    next(error); // lo atrapa el manejador de errores de app.js (500)
  }
};

// GET /api/usuarios/:id
const getUser = async (req, res, next) => {
  try {
    const usuario = await UserService.getById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

// POST /api/usuarios
const createUser = async (req, res, next) => {
  try {
    const usuario = await UserService.create(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    // Errores de validación (campos faltantes, email repetido...) -> 400
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
    const usuario = await UserService.update(req.params.id, req.body);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(200).json(usuario);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/usuarios/:id
const deleteUser = async (req, res, next) => {
  try {
    const ok = await UserService.remove(req.params.id);
    if (!ok) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.status(204).send();
  } catch (error) {
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'No se puede eliminar: el usuario tiene proyectos o usuarios asociados' });
    }
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
