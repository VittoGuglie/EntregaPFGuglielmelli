const mongoose = require('mongoose');

const collectionName = 'cart';

const collectionSchema = new mongoose.Schema({
    items: [
        {
            id: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ]
});

const Carts = mongoose.model(collectionName, collectionSchema);

module.exports = Carts;