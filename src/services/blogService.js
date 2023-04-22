const Blog = require('../models/Blog');

exports.createBlog = async ({ title, image, content, category, owner }) => {
    const blog = await Blog.create({ title, image, content, category, owner });
    return blog;
}

exports.getAll = async () => await Blog.find().lean();
exports.getOne = async (blogId) => await Blog.findById(blogId).populate('owner');
exports.getNewest = async () => await Blog.find().sort({ _id: -1 }).limit(3).lean();
exports.follow = async (blogId, userData) => await Blog.findByIdAndUpdate({ _id: blogId }, { $push: { followList: userData } });
exports.deleteBlog = async (blogId) => await Blog.findByIdAndDelete(blogId);
exports.editBlog = async (blogId, blogData) => await Blog.findByIdAndUpdate({_id: blogId}, blogData);
exports.createdBlogs = async (userId) => await Blog.find().where({ owner: userId }).lean();
exports.followedBlogs = async (userId) => await Blog.find().where({ followList : { $in : userId }}).lean();
exports.followedList = async (userId) => await Blog.find().populate('owner').lean();