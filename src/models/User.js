const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [2, 'The username must be at least 2 characters long!']
    },
    email: {
        type: String,
        required: true,
        minLength: [10, 'The email must be at least 10 characters long!']
    },
    password: {
        type: String,
        required: true,
        minLength: [4, 'The password must be at least 4 characters long!']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;