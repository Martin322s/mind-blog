const jwt = require('jsonwebtoken');
const { SECRET } = require('../../config/constants');
const authService = require('../services/authService');

exports.auth = (req, res, next) => {
    const token = req.cookies['session'];

    if (token) {
        jwt.verify(token, SECRET, ((err, decodedToken) => {
            if (err) {
                return next(err);
            }

            const user = decodedToken;
            req.user = user;
            res.locals.user = user;
            next();
        }));
    } else {
        next();
    }
}

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/login');
    } else {
        next();
    }
}

exports.isGuest = (req, res, next) => {
    if (req.user) {
        res.redirect('/');
    } else {
        next();
    }
}


exports.setEmail = async (req, res, next) => {
    const user = await authService.getAuthor(req.user._id);
    if (user) {
        res.locals.email = user.email;
        next();
    } else {
        next();
    }
}