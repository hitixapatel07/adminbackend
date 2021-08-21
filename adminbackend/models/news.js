const mongoose = require('./mongo');

const News = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    url: String,
    imgUrl: String,
    createdOn: {type: Date, default: Date.now}

});

module.exports = mongoose.model('News', News);