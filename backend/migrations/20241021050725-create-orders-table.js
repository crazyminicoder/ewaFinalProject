'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      carId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cars', key: 'id' },
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  },
};
