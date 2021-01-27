const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// const mysql = require('mysql');
// const mysql2 = require('mysql2');
const db = require('./connection');
const userRoute = require('./Routes/userRoute');
const port = 3001;


  // db test
    db.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.')
    })
  .catch (error => {
    console.error('Unable to connect to the database:', error);
  });




app.get('/', (req, res) => {
  res.send('Hello World!!')
})

app.use('/user', userRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})