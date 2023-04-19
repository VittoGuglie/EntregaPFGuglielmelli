const mongoose = require('mongoose');

const collectionName = 'cart';

const collectionSchema = new mongoose.Schema({
    user,
    message
});

const carts = mongoose.model(collectionName, collectionSchema);

module.exports = carts;