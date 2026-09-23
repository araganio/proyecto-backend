// Modelo Usuario -> tabla "usuarios"
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }, // se guarda hasheada
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'roles', key: 'id' },     // clave foránea -> roles
  },
  administrador_id: {
    type: DataTypes.INTEGER,
    allowNull: true,                                // un administrador no tiene administrador
    references: { model: 'usuarios', key: 'id' },   // clave foránea autorreferenciada
  },
}, {
  tableName: 'usuarios',
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['password'] }, // nunca devolver la contraseña en las respuestas
  },
});

module.exports = Usuario;
