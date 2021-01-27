const { Sequelize, DataTypes } = require('sequelize');
const db = require('../connection');

const User = db.define('user', {
    // userid: {
    //     type: DataTypes.INTEGER,
    //     // allowNull: false
    //   },
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
        // allowNull: false
      }
}, {
    freezeTableName: true
  });

  module.exports = User;