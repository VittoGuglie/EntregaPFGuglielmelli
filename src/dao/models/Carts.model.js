const mongoose = require('mongoose');

const collectionName = 'cart';

const collectionSchema = new mongoose.Schema();

const carts = mongoose.model(collectionName, collectionSchema);

module.exports = carts;