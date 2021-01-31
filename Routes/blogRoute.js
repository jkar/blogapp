const blogRouter = require('express').Router();
const { Op } = require("sequelize");
const Blog = require('../Models/Blog');
const Category = require('../Models/Category');
const Post = require('../Models/Post');
const CatPost = require('../Models/Cat-Post');

Blog.hasMany(Category, {
    foreignKey: 'bid'
  });

  Category.hasMany(CatPost, {
      foreignKey: 'cid'
  });

  Post.hasMany(CatPost, {
      foreignKey: 'pid'
  });

  CatPost.belongsTo(Post, {
    foreignKey: {
      name: 'pid'
    }
  })

  CatPost.belongsTo(Category, {
      foreignKey: {
          name: 'cid'
      }
  })

blogRouter.get('/', async (req, res) => {
    try {
        const data = await Blog.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.send(error);
    }
});

//ten posts with descending order
blogRouter.get('/posts', async (req, res) => {
    try {
        const data = await Post.findAll({
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
            ]
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//getting all categories related to a specific post (id)
blogRouter.get('/categories', async (req, res) => {
    try {
        //  const data = await Category.findAll();
        const data = await CatPost.findAll({
            where: {
                pid : req.body.id
            },
            include: [
                {
                    model: Category, attributes: ['id', 'bid', 'name']
                }
            ]
        })
         res.status(200).send(data);
    } catch (error) {
        res.send(error);
    }
});

//get all posts from a specific category (id)
blogRouter.get('/specificposts', async (req, res) => {
    try {
        const data = await CatPost.findAll({
            where : {
                cid : req.body.id
            },
            include : [
                { model : Post, attributes : ['id', 'title', 'content', 'createdAt'] }
            ]
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//all blogs with their categories and their posts
blogRouter.get('/all', async (req, res) => {
    try {
        const id = req.body.id;
        const data = await Blog.findAll({
            where: {
              id: id
            },
            include: [
                // {model:Category, attributes:['id', 'name']},
                // {model:Category, include: [{ model: CatPost, attributes: ['cid', 'pid'] } ]},
                {model:Category, include: [{ model: CatPost, include: [{model: Post, attributes: ['id','title', 'content', 'createdAt']}] } ]},
                
            ]
          });


        //   console.log(data[0].categories);
        // const cat = [];
        //   data[0].categories.forEach(element => {
        //       cat.push(element.dataValues)
        //   });
        //   console.log(cat)
        //   const data2 = await Category.findAll({
        //       where: {
        //         [Op.or]: cat
        //       },
        //       include: [
        //           {model:CatPost, attributes:['cid', 'pid']}
        //       ]
        //   });
        //   console.log(data2);
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});

module.exports = blogRouter;