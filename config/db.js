const mongoose = require('mongoose');
const { CONNECTION_STRING } = require('./constants');
exports.initialDatabase = () => mongoose.connect(CONNECTION_STRING);