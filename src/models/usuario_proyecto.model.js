// Modelo UsuarioProyecto -> tabla intermedia "usuarios_proyectos"
// Relación muchos a muchos: un usuario participa en varios proyectos
// y un proyecto tiene varios usuarios.
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UsuarioProyecto = sequelize.define('UsuarioProyecto', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  proyecto_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'usuarios_proyectos',
  timestamps: false,
});

module.exports = UsuarioProyecto;
