// Rutas de usuario: une cada método HTTP + ruta con su función del controlador.
const { Router } = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

const router = Router();

router.get('/', controller.getUsers);               // GET    /api/usuarios
router.get('/:id', controller.getUser);             // GET    /api/usuarios/:id
router.post('/', auth, controller.createUser);      // POST   /api/usuarios     (protegida)
router.put('/:id', auth, controller.updateUser);    // PUT    /api/usuarios/:id (protegida)
router.delete('/:id', auth, controller.deleteUser); // DELETE /api/usuarios/:id (protegida)

module.exports = router;
