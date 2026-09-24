// Rutas de usuario: une cada método HTTP + ruta con su función del controlador.
// Las rutas protegidas exigen un token válido (auth) y el permiso correspondiente.
const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { auth, requierePermiso } = require('../middlewares/auth.middleware');
const { PERMISOS } = require('../utils/constants');

const router = Router();

router.get('/', controller.getUsers);               // GET    /api/usuarios
router.get('/:id', controller.getUser);             // GET    /api/usuarios/:id

router.post('/', auth, requierePermiso(PERMISOS.CREAR), controller.createUser);
router.put('/:id', auth, requierePermiso(PERMISOS.ACTUALIZAR), controller.updateUser);
router.delete('/:id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.deleteUser);

module.exports = router;
