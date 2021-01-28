const {Sequelize, DataTypes} = require('sequelize');
const db = require('../connection');

const Category = db.define('category', {
    bid: {
        type: DataTypes.INTEGER,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
      }
}, {
    freezeTableName: true
  });

  module.exports = Category;