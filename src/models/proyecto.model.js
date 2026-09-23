// Modelo Proyecto -> tabla "proyectos"
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proyecto = sequelize.define('Proyecto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // fecha y hora
  administrador_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }, // clave foránea -> usuarios
  },
}, {
  tableName: 'proyectos',
  timestamps: false,
});

module.exports = Proyecto;
