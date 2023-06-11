const mongoose = require('mongoose');

const collectionName = 'Ticket';

const collectionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    purchase_datetime: { type: Date, required: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
});

const Tickets = mongoose.model(collectionName, collectionSchema);

module.exports = Tickets;