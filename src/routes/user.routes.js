// Rutas de usuario: une cada método HTTP + ruta con su función del controlador.
// Todas exigen token (auth) y el permiso correspondiente al rol.
const { Router } = require('express');
const controller = require('../controllers/user.controller');
const { auth, requierePermiso } = require('../middlewares/auth.middleware');
const { PERMISOS } = require('../utils/constants');

const router = Router();

// OJO con el orden: "/rol/:rol_id" va antes que "/:id",
// si no Express creería que "rol" es un id.
router.get('/', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getUsers);
router.get('/rol/:rol_id', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getUsersByRol);
router.get('/:id', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getUser);

router.post('/', auth, requierePermiso(PERMISOS.CREAR), controller.createUser);
router.put('/:id', auth, requierePermiso(PERMISOS.ACTUALIZAR), controller.updateUser);
router.delete('/:id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.deleteUser);

module.exports = router;
