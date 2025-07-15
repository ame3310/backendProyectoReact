"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("OrderProduct", [
      {
        orderId: 1,
        productId: 1,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 1,
        productId: 3,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 2,
        productId: 2,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 3,
        productId: 5,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        orderId: 3,
        productId: 4,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("OrderProduct", null, {});
  },
};
