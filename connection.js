const Sequelize = require('sequelize');

//db connection
module.exports =  new Sequelize('blogapp', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql'
});