const mongoose = require('./mongo');

const Inventory = new mongoose.Schema({
    // title: String,
    // description: String,
    // category: String,
    // url: String,
    // imgUrl: String,
    // createdOn: {type: Date, default: Date.now},

    productName: String,
    productCategory: String,
    manufacturer: String,
    productImage: String,
    stock: String,
    unitCost: String,
    dimension: String,
    purchaseOrders: String,
    nextPurchase: String,
    createdBy: String,
    createdDate: {type: Date, default: Date.now}

});

module.exports = mongoose.model('Inventory', Inventory);