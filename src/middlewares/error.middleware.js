// Middlewares de manejo de errores.
// Van al FINAL de app.js, después de todas las rutas, porque Express los
// ejecuta solo cuando ninguna ruta anterior respondió o cuando ocurre un error.

// 404 Not Found: la petición no coincidió con ninguna ruta.
const notFound = (req, res) => {
  res.status(404).json({
    message: `Ruta ${req.method} ${req.originalUrl} no encontrada`,
  });
};

// 500 Internal Server Error: error inesperado del servidor.
// Express reconoce que es un manejador de errores porque recibe CUATRO
// parámetros, siendo el primero el error. Se llega aquí cuando un
// controlador ejecuta next(error).
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Error interno del servidor',
  });
};

module.exports = { notFound, errorHandler };
