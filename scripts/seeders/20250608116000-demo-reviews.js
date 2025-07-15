"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Reviews", [
      {
        rating: "5",
        comment: "¡Producto excelente!",
        userId: 2,
        productId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        rating: "4",
        comment: "Muy bueno, aunque llegó con retraso.",
        userId: 3,
        productId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        rating: "2",
        comment: "Me esperaba más calidad.",
        userId: 4,
        productId: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Reviews", null, {});
  },
};
