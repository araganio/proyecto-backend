// server.js: punto de entrada. Conecta la base de datos y enciende el servidor.
const app = require('./app');
const { port } = require('./config/dotenv');
const { conectarDB } = require('./config/database');

const iniciar = async () => {
  await conectarDB(); // primero la base de datos

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
  });
};

iniciar();
