const blogRouter = require('express').Router();
const db = require('../connection');
const { Op, QueryTypes, Sequelize } = require("sequelize");
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

//get blogs 
blogRouter.get('/blogs', async (req,res) => {
    try {
        const data = await Blog.findAll();
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//ten posts with descending order by specific blog id
blogRouter.get('/posts', async (req, res) => {
    try {
        const data = await db.query('select distinct post.id, post.title, post.content, post.createdAt from post, catpost, category, blog where post.id = catpost.pid and catpost.cid = category.id and category.bid = blog.id and blog.id=? ORDER BY post.createdAt DESC limit 10',
        {
          replacements: [req.query.id],
          type: db.QueryTypes.SELECT
        }
        )
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//getting all categories related to a specific post (id)
blogRouter.get('/categories', async (req, res) => {

    try {
        const data = await CatPost.findAll({
            where: {
                pid : req.query.id
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
                cid : req.query.id
            },
            include : [
                { model : Post, attributes : ['id', 'title', 'content', 'createdAt'] },
                {model: Category, attributes: ['id','name']}
            ]
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get blog with each categories and each posts , using blog (id)
blogRouter.get('/all', async (req, res) => {
    try {
        const id = req.body.id;
        const data = await Blog.findAll({
            where: {
              id: id
            },
            include: [
                {model:Category, include: [{ model: CatPost, include: [{model: Post, attributes: ['id','title', 'content', 'createdAt']}] } ]},
  
            ]
          });
        res.status(200).send(data);
    } catch (error) {
        console.log(error)
        res.status(400).send(error);
    }
});

module.exports = blogRouter;