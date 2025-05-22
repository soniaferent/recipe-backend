'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Recipe extends Model {
    static associate(models) {
      Recipe.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "category",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }

  Recipe.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kcal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    
    
  }, {
    sequelize,
    modelName: 'Recipe',
  });

  return Recipe;
};
