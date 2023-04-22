const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [5, 'The title must be at least 5 characters long!'],
        maxLength: [50, 'The title must be maximum 50 characters long!']
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function () {
                return this.image.startsWith('http');
            }
        }
    },
    content: {
        type: String,
        required: true,
        minLength: [10, 'The content must be at least 10 characters long!']
    },
    category: {
        type: String,
        required: true,
        minLength: [3, 'The category must be at least 3 characters long!']
    },
    followList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;