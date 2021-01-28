const blogRouter = require('express').Router();
const Blog = require('../Models/Blog');
const Category = require('../Models/Category');

Blog.hasMany(Category, {
    foreignKey: 'bid'
  });

blogRouter.get('/', async (req, res) => {
    try {
        const data = await Blog.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.send(error);
    }
});

blogRouter.get('/category', async (req, res) => {
    try {
         const data = await Category.findAll();
         res.status(200).send(data);
    } catch (error) {
        res.send(error);
    }
});

blogRouter.get('/all', async (req, res) => {
    try {
        const id = req.body.id;
        const data = await Blog.findAll({
            where: {
              id: id
            },
            include: [
                {model:Category, attributes:['id', 'name']}
            ]
          });
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});

module.exports = blogRouter;