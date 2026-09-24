// Middleware de autenticación con JWT.
// Un middleware es una función que se ejecuta ANTES del controlador.
// Aquí se revisa que la petición traiga un token válido en la cabecera:
//   Authorization: Bearer <token>
//
//   401 Unauthorized → no envió token o el token no es válido / está vencido
//   403 Forbidden    → el token es válido pero al usuario le falta el permiso
const { verificarToken } = require('../services/auth.service');

const auth = (req, res, next) => {
  const cabecera = req.header('Authorization');

  if (!cabecera || !cabecera.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Falta el token (Authorization: Bearer <token>)' });
  }

  const token = cabecera.split(' ')[1];

  try {
    // Si la firma no coincide o el token venció, verify lanza un error
    req.usuario = verificarToken(token); // deja los datos del usuario disponibles
    next();                              // todo bien, sigue al controlador
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Middleware que además exige un permiso concreto.
// Se usa así:  router.post('/', auth, requierePermiso('crear'), controller.crear)
const requierePermiso = (permiso) => (req, res, next) => {
  if (!req.usuario || !req.usuario.permisos.includes(permiso)) {
    return res.status(403).json({ message: `No tienes el permiso "${permiso}"` });
  }
  next();
};

module.exports = auth;
module.exports.auth = auth;
module.exports.requierePermiso = requierePermiso;
