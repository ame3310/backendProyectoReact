"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ProductCategory", [
      {
        productId: 1,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 2,
        categoryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 3,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 4,
        categoryId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        productId: 5,
        categoryId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("ProductCategory", null, {});
  },
};
