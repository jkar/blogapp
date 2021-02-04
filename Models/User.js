const { DataTypes } = require('sequelize');
const db = require('../connection');

const User = db.define('user', {
    bid: {
        type: DataTypes.INTEGER,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
    password: {
        type: DataTypes.STRING,
      }
}, {
    freezeTableName: true
  });

  module.exports = User;