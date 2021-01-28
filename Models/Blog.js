const {Sequelize, DataTypes} = require('sequelize');
const db = require('../connection');

const Blog = db.define('blog', {
    uid: {
        type: DataTypes.INTEGER,
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
      },
}, {
    freezeTableName: true
  });


module.exports = Blog;