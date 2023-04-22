const router = require('express').Router();
const blogService = require('../services/blogService');
const authService = require('../services/authService');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/blogs', async (req, res) => {
    const blogs = await blogService.getAll();
    res.render('blog/catalog', { blogs });
});

router.get('/create', isAuth, (req, res) => {

    res.render('blog/create');
});

router.post('/create', isAuth, async (req, res) => {
    try {
        const owner = req.user._id;
        const { title, image, content, category } = req.body;
        const blog = await blogService.createBlog({ title, image, content, category, owner });

        if (blog) {
            res.redirect('/mind/blogs');
        } else {
            res.render('blog/create');
        }
    } catch (err) {
        res.render('blog/create', { error: err.message });
    }
});

router.get('/details/:blogId', async (req, res) => {
    const blogId = req.params.blogId;
    const blog = await blogService.getOne(blogId);
    const isOwner = blog.owner._id == req.user?._id;
    const mapped = blog.followList.map(x => x.toString());
    const isFollowed = mapped.includes(req.user?._id.toString());
    const followedList = [];

    for (let user of blog.followList) {
        const email = await authService.getAuthor(user);
        followedList.push(email);
    }

    const emails = followedList.map(x => x.email);

    res.render('blog/details', {
        _id: blog._id,
        title: blog.title,
        image: blog.image,
        content: blog.content,
        category: blog.category,
        owner: blog.owner.email,
        isOwner,
        isFollowed,
        followed: emails.join(', ')
    });
});

router.get('/details/:blogId/follow', isAuth, async (req, res) => {
    const blogId = req.params.blogId;
    const userId = req.user?._id;
    const user = await authService.getAuthor(userId);
    const userData = { _id: userId, email: user.email }
    await blogService.follow(blogId, userData);
    res.redirect(`/mind/details/${blogId}`);
});

router.get('/details/:blogId/edit', isAuth, async (req, res) => {
    const blogId = req.params.blogId;
    const blog = await blogService.getOne(blogId);
    res.render('blog/edit', {
        title: blog.title,
        image: blog.image,
        content: blog.content,
        category: blog.category
    });
});

router.post('/details/:blogId/edit', isAuth, async (req, res) => {
    try {
        const { title, image, content, category } = req.body;
        if (title == '' || category == '' || image == '' || content == '') {
            throw {
                message: "All fields are required!",
                fields: {
                    title, 
                    image,
                    content,
                    category
                }
            }
        } else {
            const blogId = req.params.blogId;
            const { title, image, content, category } = req.body;
            await blogService.editBlog(blogId, { title, image, content, category });
            res.redirect(`/mind/details/${blogId}`);
        }
    } catch (err) {
        res.render('blog/edit', { error: err.message, fields: err.fields });
    }
});

router.get('/details/:blogId/delete', isAuth, async (req, res) => {
    const blogId = req.params.blogId;
    await blogService.deleteBlog(blogId);
    res.redirect('/mind/blogs');
});

module.exports = router;