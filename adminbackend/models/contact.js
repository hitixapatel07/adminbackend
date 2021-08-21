const { Mongoose } = require("mongoose")

const mongoose = require('./mongo');

const Contact = new mongoose.Schema({
    Email: String,
    Msg: String,
    createdOn: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Contact', Contact);