const { Sequelize, DataTypes } = require('sequelize');
const db = require('../connection');

const Post = db.define('post', {
    title : {
        type: DataTypes.STRING,
    },
    content : {
        type : DataTypes.STRING
    },
    createdAt : {
        type : DataTypes.DATE
    }
}, {
    freezeTableName: true
});

module.exports = Post;