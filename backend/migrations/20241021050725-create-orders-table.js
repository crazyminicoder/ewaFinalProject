'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
      },
      carId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Cars', key: 'id' },
        onDelete: 'CASCADE',
      },
      items: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      customerDetails: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      paymentDetails: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      fraudAnalysis: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  // down: async (queryInterface, Sequelize) => {
  //   await queryInterface.dropTable('Orders');
  // },
};