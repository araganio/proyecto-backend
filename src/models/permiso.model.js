// Modelo Permiso -> tabla "permisos"
// Los permisos son las acciones que puede hacer un rol:
// crear, visualizar, actualizar y eliminar.
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Permiso = sequelize.define('Permiso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false, unique: true },
}, {
  tableName: 'permisos',
  timestamps: false,
});

module.exports = Permiso;
