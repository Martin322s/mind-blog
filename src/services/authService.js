const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const jwtSign = promisify(jwt.sign);
const { SALT_ROUNDS, SECRET } = require('../../config/constants');
const User = require('../models/User');

exports.registerUser = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ username, email, password: hashedPassword });
    return user;
}
exports.loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
        return user;
    } else {
        return "Invalid email or password provided.";
    }
}

exports.generateWebToken = async (user) => {
    const token = await jwtSign({ _id: user._id }, SECRET, { expiresIn: '2d' });
    return token;
}

exports.getAuthor = async (userId) => await User.findById(userId).lean();