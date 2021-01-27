const router = require('express').Router();
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

module.exports = router;