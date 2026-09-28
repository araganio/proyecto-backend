// Rutas de proyectos.
const { Router } = require('express');
const controller = require('../controllers/project.controller');
const { auth, requierePermiso } = require('../middlewares/auth.middleware');
const { PERMISOS } = require('../utils/constants');

const router = Router();

// Las rutas con texto fijo van antes que las de ":id"
router.get('/mis-participaciones', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getMyParticipations);
router.get('/', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getProjects);
router.get('/:id', auth, requierePermiso(PERMISOS.VISUALIZAR), controller.getProject);

router.post('/', auth, requierePermiso(PERMISOS.CREAR), controller.createProject);
router.put('/:id', auth, requierePermiso(PERMISOS.ACTUALIZAR), controller.updateProject);
router.delete('/:id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.deleteProject);

// Participación de usuarios en el proyecto
router.post('/:id/usuarios', auth, requierePermiso(PERMISOS.CREAR), controller.addUser);
router.delete('/:id/usuarios/:usuario_id', auth, requierePermiso(PERMISOS.ELIMINAR), controller.removeUser);

module.exports = router;
