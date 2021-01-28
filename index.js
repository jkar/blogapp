const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
// const mysql = require('mysql');
// const mysql2 = require('mysql2');
const db = require('./connection');
const userRouter = require('./Routes/userRoute');
const blogRouter = require('./Routes/blogRoute');
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

app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/blog', blogRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})