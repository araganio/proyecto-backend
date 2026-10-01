// Rutas de proyectos.
const { Router } = require('express');
const controller = require('../controllers/project.controller');
const { auth, requierePermiso } = require('../middlewares/auth.middleware');
const { PERMISOS } = require('../utils/constants');

const router = Router();

// Las rutas con texto fijo van ANTES que las de ":id",
// si no Express creería que "todos" es un id.
router.get('/todos', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getAllProjects);
router.get('/', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getProjects);
router.get('/:id', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getProject);

router.post('/', auth, requierePermiso(PERMISOS.CREAR), controller.createProject);
router.put('/:id', auth, requierePermiso(PERMISOS.ACTUALIZAR), controller.updateProject);
router.delete('/:id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.deleteProject);

// Participación de usuarios en el proyecto
router.post('/:id/usuarios', auth, requierePermiso(PERMISOS.CREAR), controller.assignUsers);
router.delete('/:id/usuarios/:usuario_id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.removeUser);

module.exports = router;
