"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Reviews", {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      rating: {
        type: Sequelize.ENUM("0", "1", "2", "3", "4", "5"),
        allowNull: false,
      },
      comment: Sequelize.TEXT,
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "RESTRICT",
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Products", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      deletedAt: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Reviews");
  },
};
