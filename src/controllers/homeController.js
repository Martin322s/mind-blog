const router = require('express').Router();
const blogService = require('../services/blogService');

router.get('/', async (req, res) => {
    const blogs = await blogService.getNewest();
    res.render('home', { blogs });
});

module.exports = router;