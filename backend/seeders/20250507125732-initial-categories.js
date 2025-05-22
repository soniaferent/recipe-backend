// seeders/XXXXXXXXXX-initial-categories.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Categories", [
      {
        id: 1,
        name: "Desserts",
        description: "Sweet and delicious treats",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Appetizers",
        description: "Small dishes to start your meal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Main Courses",
        description: "The main part of your meal",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Beverages",
        description: "Refreshing drinks",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null, {});
  }
};
