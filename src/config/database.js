// Conexión a PostgreSQL usando Sequelize (ORM).
// Un ORM nos deja trabajar con las tablas como objetos de JavaScript
// en lugar de escribir todo el SQL a mano.
// Dependencias: npm install sequelize pg pg-hstore
const { Sequelize } = require('sequelize');
const { db } = require('./dotenv');

const sequelize = new Sequelize(db.name, db.user, db.pass, {
  host: db.host,
  port: db.port,
  dialect: 'postgres',
  logging: false, // pon true si quieres ver el SQL que genera en consola
});

// Prueba la conexión. Se llama desde server.js antes de encender el servidor.
const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conectado a PostgreSQL (base de datos: ${db.name})`);
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }
};

module.exports = { sequelize, conectarDB };
