// Modelo Rol -> tabla "roles"
// Cada modelo de Sequelize representa una tabla de la base de datos.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rol = sequelize.define('Rol', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, {
  tableName: 'roles',
  timestamps: false, // la tabla no tiene createdAt / updatedAt
});

module.exports = Rol;
