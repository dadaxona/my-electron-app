'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mijoz extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mijoz.belongsTo(models.Admin, {
        foreignKey: 'adminId'
      })
      Mijoz.belongsTo(models.Smen, {
        foreignKey: 'smenId'
      })
    }
  }
  Mijoz.init({
    adminId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    smenId: DataTypes.INTEGER,
    ism: DataTypes.STRING,
    fam: DataTypes.STRING,
    shar: DataTypes.STRING,
    rasm: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mijoz',
  });
  return Mijoz;
};