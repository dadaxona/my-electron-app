'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Analizs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      adminId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      mijozId: {
        type: Sequelize.INTEGER
      },
      ism: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fam: {
        allowNull: true,
        type: Sequelize.STRING
      },
      shar: {
        allowNull: true,
        type: Sequelize.STRING
      },
      smen: {
        allowNull: true,
        type: Sequelize.STRING
      },
      a1: {
        allowNull: true,
        type: Sequelize.STRING
      },
      a2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      kirish: {
        allowNull: true,
        type: Sequelize.STRING
      },
      chiqish: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sana: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Analizs');
  }
};