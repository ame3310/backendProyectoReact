"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ProductCategory", {
      productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: "Categories", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("ProductCategory");
  },
};
