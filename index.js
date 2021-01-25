const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql');
const port = 3001;


// db connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'blogapp'
  });

  // db test
  db.connect((error) => {
    if (error) {
        throw error;
    }
    console.log('connected..');
  });




app.get('/', (req, res) => {
  res.send('Hello World!!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})