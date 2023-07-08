const mongoose = require('mongoose');

const collectionName = 'product';

const collectionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    code: String,
    thumbnail: String,
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: 'Admin',
    }
});

const Products = mongoose.model(collectionName, collectionSchema);

module.exports = Products;