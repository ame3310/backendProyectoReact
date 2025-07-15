"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Products", [
      {
        name: "Figura Mario",
        description: "Figura coleccionable de Mario Bros.",
        price: 19.99,
        images: JSON.stringify(["mario.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Figura Link",
        description: "Figura coleccionable de Zelda",
        price: 24.99,
        images: JSON.stringify(["link.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Peluche Pikachu",
        description: "Peluche de 20cm de Pikachu",
        price: 14.99,
        images: JSON.stringify(["pikachu.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Camiseta Naruto",
        description: "Camiseta con estampado de Naruto",
        price: 17.99,
        images: JSON.stringify(["naruto.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Funko Iron Man",
        description: "Figura Funko Pop de Iron Man",
        price: 12.49,
        images: JSON.stringify(["ironman.jpg"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
