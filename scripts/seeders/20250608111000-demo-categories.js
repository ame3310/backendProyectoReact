"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Categories", [
      { name: "Videojuegos", createdAt: new Date(), updatedAt: new Date() },
      { name: "Anime", createdAt: new Date(), updatedAt: new Date() },
      { name: "Peluches", createdAt: new Date(), updatedAt: new Date() },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
