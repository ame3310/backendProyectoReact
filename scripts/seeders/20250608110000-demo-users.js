"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        userName: "Admin",
        email: "admin@example.com",
        password: await bcrypt.hash("admin123", 10),
        role: "admin",
        avatar: "1749504482368-silicato.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        userName: "User 1",
        email: "user1@example.com",
        password: await bcrypt.hash("user1234", 10),
        role: "user",
        avatar: "1749504482368-silicato.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        userName: "User 2",
        email: "user2@example.com",
        password: await bcrypt.hash("user2345", 10),
        role: "user",
        avatar: "1749504482368-silicato.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        userName: "User 3",
        email: "user3@example.com",
        password: await bcrypt.hash("user3456", 10),
        role: "user",
        avatar: "1749504482368-silicato.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        userName: "User 4",
        email: "user4@example.com",
        password: await bcrypt.hash("user4567", 10),
        role: "user",
        avatar: "1749504482368-silicato.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
