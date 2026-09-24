// Rutas de autenticación.
const { Router } = require('express');
const controller = require('../controllers/auth.controller');

const router = Router();

router.post('/login', controller.login); // POST /api/auth/login

module.exports = router;
