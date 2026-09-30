// app.js: configura la aplicación de Express (middlewares y rutas).
// NO enciende el servidor, de eso se encarga server.js.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const projectRoutes = require('./routes/project.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

// --- Middlewares globales ---
app.use(helmet());          // seguridad en cabeceras HTTP
app.use(cors());            // permite peticiones desde otros orígenes (ej. Angular)
app.use(morgan('dev'));     // muestra en consola cada petición recibida
app.use(express.json());    // permite leer JSON en req.body

// --- Rutas ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/proyectos', projectRoutes);

// --- Manejo de errores (siempre al final, después de las rutas) ---
app.use(notFound);      // 404: ninguna ruta coincidió
app.use(errorHandler);  // 500: error inesperado

module.exports = app;
