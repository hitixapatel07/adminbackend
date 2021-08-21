const { Mongoose } = require("mongoose")

const mongoose = require('./mongo');

const Contact = new mongoose.Schema({
    email: String,
    msg: String,
    createdOn: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Contact', Contact);