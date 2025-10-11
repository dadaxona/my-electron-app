'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.hasMany(models.Device, {
        foreignKey: 'adminId'
      })
    }
  }
  Admin.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    key: DataTypes.TEXT,
    count: DataTypes.INTEGER,
    count2: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};