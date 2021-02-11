const Sequelize = require('sequelize');

//db connection
// module.exports =  new Sequelize('blogapp', 'root', '1234', {
//   host: 'localhost',
//   dialect: 'mysql'
// });
module.exports =  new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});