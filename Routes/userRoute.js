const router = require('express').Router();
const { Op } = require("sequelize");
const Blog = require('../Models/Blog');
const Category = require('../Models/Category');
const Post = require('../Models/Post');
const CatPost = require('../Models/Cat-Post');
const User = require('../Models/User');
const db = require('../connection');

router.get('/', async (req, res) => {
    try {
        const data = await User.findAll();
        res.send(data);
    } catch (err) {
        res.send(err);
    }
});

// CREATE a post in 'post' table and insert also in 'catpost' table, the appropriate cids and pid related to that post.
//(in a form for creating post, when user set category/ies ,an array with their ids will be added in 'cid' field)

//Dummy body
// {
//     "title": "test title",
//     "content": "test content",
//     "cid": [1, 2]
// }

router.post('/createpost', async (req, res) => {
    try {
        const data = await Post.create({
            title: req.body.title,
            content: req.body.content,
            // catposts: [
            //   { cid: req.body.cid, pid: ''},
            //   { cid: req.body.cid, pid: ''}
            // ]
        //   }, {
        //     include: [ CatPost ]
          });
        const cids = req.body.cid;
        const cidlist = cids.map(el =>{
            return {'cid': el, 'pid': data.id }
        });
        const data2 = await CatPost.bulkCreate(cidlist);
          res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE/EDIT post in 'post' table (using post (id)) and update also 'catpost' (using post (id)-> pid) table with the appropriate cids and pid related to that post.
// DUMMY BODY
// a form for updating a post in 'post' table , using each (id) and cid array is the category ids that the post belongs.
// !!!!! In the front what is not changing must be in the body request  
// {
//     "id": 6,
//     "title": "test title6",
//     "content": "test content6",
//     "cid":[1,2]
// }
router.post('/updatepost', async (req, res)=>{
    try {
        const data = await Post.update({ title: req.body.title, content: req.body.content }, {
            where: {
              id: req.body.id
            }
          });
        const data2 = await CatPost.destroy({
            where: {
              pid: req.body.id
            }
          });
          const cids = req.body.cid;
          const cidlist = cids.map(el =>{
              return {'cid': el, 'pid': req.body.id }
          });
          console.log(cidlist);
          const data3  = await CatPost.bulkCreate(cidlist);
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Updating category in 'category' table, using category (id)
// DUMMY BODY
// {
//     "id": 1,
//     "name": "sports" 
// }
router.post('/updatecategory', async (req, res) => {
    try {
        const data = await Category.update({ name: req.body.name }, {
            where: {
              id: req.body.id
            }
          });
          res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;