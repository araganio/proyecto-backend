// Modelo Usuario -> tabla "usuarios"
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false }, // se guarda hasheada
  rol_id: { type: DataTypes.INTEGER, allowNull: false },       // clave foránea -> roles
  administrador_id: { type: DataTypes.INTEGER, allowNull: true }, // clave foránea -> usuarios
}, {
  tableName: 'usuarios',
  timestamps: false,
  defaultScope: {
    attributes: { exclude: ['password'] }, // nunca devolver la contraseña en las respuestas
  },
});

module.exports = Usuario;
