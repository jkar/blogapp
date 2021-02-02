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
        // const data = await Post.findAll({
        //     limit: 10,
        //     order: [
        //         ['createdAt', 'DESC'],
        //     ]
        // });
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
//DUMMY BODY
// {
//     "id" : 4
// }
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
//DUMMY BODY
// {
//     "id" : 1
// }
blogRouter.get('/specificposts', async (req, res) => {
    try {
        const data = await CatPost.findAll({
            where : {
                cid : req.query.id
            },
            include : [
                { model : Post, attributes : ['id', 'title', 'content', 'createdAt'] },
                {model: Category, attributes: ['id','name']}
                // { model : Post, include : [{model: Category, attributes: ['id','name']}] }
            ]
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//get blog with each categories and each posts , using blog (id)
//DUMMY BODY
// {
//     "id" : 2 
// }
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
                // {model:Category, include: [{ model: CatPost, include: [{model: Post, attributes: ['id','title', 'content', 'createdAt'], seperate: true, limit:1 }] } ]},
                
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