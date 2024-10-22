'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'carId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'carId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'cars', key: 'id' },
      onDelete: 'CASCADE',
    });
  },
};
