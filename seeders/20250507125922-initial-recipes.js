// seeders/XXXXXXXXXX-initial-recipes.js
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Recipes", [
      {
        name: "Chocolate Cake",
        kcal: 350,
        time: "45 minutes",
        image: "https://example.com/chocolate-cake.jpg",
        CategoryId: 1, // Desserts
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Cheese Pizza",
        kcal: 280,
        time: "20 minutes",
        image: "https://example.com/cheese-pizza.jpg",
        CategoryId: 3, // Main Courses
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Caesar Salad",
        kcal: 150,
        time: "15 minutes",
        image: "https://example.com/caesar-salad.jpg",
        CategoryId: 2, // Appetizers
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Mango Smoothie",
        kcal: 200,
        time: "5 minutes",
        image: "https://example.com/mango-smoothie.jpg",
        CategoryId: 4, // Beverages
        UserId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Recipes", null, {});
  }
};
