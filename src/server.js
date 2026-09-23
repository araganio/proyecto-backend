// server.js: punto de entrada del backend.
// 1) prueba la conexión con PostgreSQL, 2) sincroniza los modelos, 3) enciende Express.
const app = require('./app');
const sequelize = require('./config/db');
const { port, db } = require('./config/dotenv');
require('./models/asociaciones'); // carga los modelos y sus relaciones

sequelize.authenticate()
  .then(() => {
    console.log(`Conexión exitosa con PostgreSQL (base de datos: ${db.name})`);

    // sync() sincroniza los modelos con la base de datos.
    // Sin alter ni force: no modifica ni recrea las tablas existentes.
    return sequelize.sync();
  })
  .then(() => {
    console.log('Modelos sincronizados correctamente');

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error.message);
  });
