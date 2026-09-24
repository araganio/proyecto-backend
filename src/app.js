// app.js: configura la aplicación de Express (middlewares y rutas).
// NO enciende el servidor, de eso se encarga server.js.
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

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

// --- 404: ninguna ruta coincidió ---
app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.method} ${req.originalUrl} no encontrada` });
});

// --- 500: error inesperado ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;
