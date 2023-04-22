const router = require('express').Router();
const { isGuest, isAuth } = require('../middlewares/authMiddleware');
const authService = require('../services/authService');
const blogService = require('../services/blogService');

router.get('/register', isGuest, (req, res) => {
    res.render('auth/register');
});

router.post('/register', isGuest, async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;
    try {
        if (password === repeatPassword) {
            const user = await authService.registerUser({ username, email, password });
            const token = await authService.generateWebToken(user);
            res.cookie('session', token, { httpOnly: true });
            res.redirect('/');
        } else {
            throw {
                message: "Passwords do not match!"
            }
        }
    } catch (err) {
        res.render('auth/register', { error: err.message });
    }
});

router.get('/login', isGuest, (req, res) => {
    res.render('auth/login');
});

router.post('/login', isGuest, async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email != '' && password != '') {
            const user = await authService.loginUser({ email, password });
            if (typeof user === 'string') {
                throw {
                    message: user
                }
            } else {
                const token = await authService.generateWebToken(user);
                res.cookie('session', token, { httpOnly: true });
                res.redirect('/');
            }
        } else {
            throw {
                message: "Invalid email or password!"
            }
        }
    } catch (err) {
        res.render('auth/login', { error: err.message });
    }
});

router.get('/logout', isAuth, (req, res) => {
    res.clearCookie('session');
    res.redirect('/');
});

router.get('/profile', isAuth, async (req, res) => {
    const author = await authService.getAuthor(req.user?._id);
    const createdBlogs = await blogService.createdBlogs(author._id);
    const totalCreated = createdBlogs.length;
    const followedBlogs = await blogService.followedBlogs(author._id);
    const totalFollowed = followedBlogs.length;
    res.render('auth/profile', { author, totalCreated, created: createdBlogs, totalFollowed, followed: followedBlogs });
});

module.exports = router;