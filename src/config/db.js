// Conexión a PostgreSQL usando Sequelize (ORM).
// Un ORM nos deja trabajar con las tablas como objetos de JavaScript
// en lugar de escribir todo el SQL a mano.
// Dependencias: npm install sequelize pg pg-hstore
const { Sequelize } = require('sequelize');
const { db } = require('./dotenv'); // variables de entorno cargadas del archivo .env

// Instancia de Sequelize: nombre de la base de datos, usuario y contraseña
const sequelize = new Sequelize(db.name, db.user, db.pass, {
  host: db.host,        // dónde está PostgreSQL (localhost)
  port: db.port,        // puerto de PostgreSQL (5432)
  dialect: 'postgres',  // motor de base de datos
  logging: false,       // en true muestra en consola el SQL que genera
  timezone: '-05:00',   // zona horaria de Colombia
});

module.exports = sequelize;
