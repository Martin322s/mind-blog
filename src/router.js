const router = require('express').Router();
const homeController = require('./controllers/homeController');
const authController = require('./controllers/authController');
const blogController = require('./controllers/blogController');

router.use('/', homeController);
router.use('/auth', authController);
router.use('/mind', blogController);
router.get('*', (req, res) => { res.render('404') });

module.exports = router;