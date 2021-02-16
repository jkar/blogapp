const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const db = require('./connection');
const userRouter = require('./Routes/userRoute');
const blogRouter = require('./Routes/blogRoute');
const port = process.env.PORT;


  // db test
    db.authenticate()
    .then(() => {
    console.log('Connection has been established successfully.')
    })
  .catch (error => {
    console.error('Unable to connect to the database:', error);
  });


app.use(cors());
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.use((req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  });

app.listen(port, () => {
  console.log(`blogapp app listening at port....`)
})