"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("OrderProduct", {
      orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "Orders", key: "id" },
        onDelete: "CASCADE",
      },
      productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("OrderProduct");
  },
};
