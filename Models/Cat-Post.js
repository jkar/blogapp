const { Sequelize, DataTypes } = require('sequelize');
const db = require('../connection');

const CatPost = db.define('catpost', {
    cid: {
        type: DataTypes.INTEGER,
      },
    pid: {
        type: DataTypes.INTEGER,
      }
}, {
    freezeTableName: true
});

module.exports = CatPost;