// Middleware de autenticación (versión sencilla).
// Un middleware es una función que se ejecuta ANTES del controlador.
// Revisa que la petición traiga la cabecera "x-api-key" con la clave del .env.
//   401 Unauthorized → no envió la clave
//   403 Forbidden    → envió una clave incorrecta
const { apiKey } = require('../config/dotenv');

const auth = (req, res, next) => {
  const key = req.header('x-api-key');

  if (!key) {
    return res.status(401).json({ message: 'Falta la cabecera x-api-key' });
  }
  if (key !== apiKey) {
    return res.status(403).json({ message: 'API key incorrecta' });
  }

  next(); // todo bien, sigue al controlador
};

module.exports = auth;
