const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const Blog = require('../Models/Blog');
const Category = require('../Models/Category');
const Post = require('../Models/Post');
const CatPost = require('../Models/Cat-Post');
const User = require('../Models/User');
const db = require('../connection');

//get all users
router.get('/', async (req, res) => {
    try {
        const data = await User.findAll();
        res.send(data);
    } catch (err) {
        res.send(err);
    }
});


//log in by providing email and password
router.post('/login', async (req, res) => {
    try {
        const data = await User.findAll({ 
            where : {
                [Op.and]: [
                    { email: req.body.email },
                    { password: req.body.password }
                  ]
            }
         });
         if (data.length === 0) {
            return res.status(401).json({
            error: 'invalid email or password'
            });
          } else {
            const userForToken = {
                id: data[0].id,
                name: data[0].name,
                bid: data[0].bid,
                email: data[0].email,
              }
              const token = jwt.sign(userForToken, 'login');
              res.status(200).send({token, userForToken });
          }


    } catch (error) {
        res.status(400).send(error);
    }
});

//get categories related with a blog (id)
router.get('/categories', async (req, res) => {
    try {
        const data = await Category.findAll({
            where : {
                bid: req.query.id
            }
        });
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send(error);
    }
}),

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
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(400).json({msg : "No Token"});
        } else {
            token = token.substring(7);
            jwt.verify(token, 'login', async (err, authData) => {
    
                try {
    
                    if (err) {
                        return res.status(401).send({ msg : "Invalid Token" });
                    } else {
                            try {
                                const data = await Post.create({
                                    title: req.body.title,
                                    content: req.body.content,
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

                    }
                } catch (err) {
                    return res.status(400).json({msg : err.message});
                }
            });
        }  
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

// create category in 'category' table, and passing bid, the id for the specific blog
//DUMMY BODY
// {
//     "bid": 1,
//     "name": "gossip"
// }
router.post('/createcategory', async (req, res) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(400).json({msg : "no token"});
        } else {
            token = token.substring(7);
            jwt.verify(token, 'login', async (err, authData) => {
    
                try {
    
                    if (err) {
                        return res.status(401).send({ msg : "INVALID TOKEN" });
                    } else {
        
                        const data = await Category.create({
                            bid : req.body.id,
                            name: req.body.name
                        });
                        res.status(200).send(data);
                    }
                } catch (err) {
                    return res.status(400).json({msg : err.message});
                }
            });
        }  
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;