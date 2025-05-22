'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      
      Category.hasMany(models.Recipe, {
        foreignKey: "CategoryId",
        as: "recipes",
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      });
    }
  }

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Category',
  });

  return Category;
};
