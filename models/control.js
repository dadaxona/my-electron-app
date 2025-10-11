'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Control extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Control.belongsTo(models.Mijoz, {
        foreignKey: 'mijozId'
      })
    }
  }
  Control.init({
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    mijozId: DataTypes.INTEGER,
    ism: DataTypes.STRING,
    fam: DataTypes.STRING,
    shar: DataTypes.STRING,
    smen: DataTypes.STRING,
    a1: DataTypes.STRING,
    a2: DataTypes.STRING,
    kirish: DataTypes.STRING,
    chiqish: DataTypes.STRING,
    sana: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Control',
  });
  return Control;
};