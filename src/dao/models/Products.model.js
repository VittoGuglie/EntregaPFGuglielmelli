const mongoose = require('mongoose');

const collectionName = 'product';

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    thumbnail: String,
    stock: Number,
});

const Products = mongoose.model(collectionName, collectionSchema);

module.exports = Products;