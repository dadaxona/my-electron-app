'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Device.belongsTo(models.Admin, {
        foreignKey: 'adminId'
      });
    }
  }
  Device.init({
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    ip: DataTypes.STRING,
    method: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};