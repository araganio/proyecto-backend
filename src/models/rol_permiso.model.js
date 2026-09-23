// Modelo RolPermiso -> tabla intermedia "roles_permisos"
// Relaciona cada rol con los permisos que tiene:
//   Administrador -> crear, visualizar, actualizar, eliminar
//   Usuario       -> visualizar
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RolPermiso = sequelize.define('RolPermiso', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rol_id: { type: DataTypes.INTEGER, allowNull: false },
  permiso_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'roles_permisos',
  timestamps: false,
});

module.exports = RolPermiso;
