const mongoose = require('mongoose');

const collectionName = 'message';

const collectionSchema = new mongoose.Schema({
    user,
    message
});

const Messages = mongoose.model(collectionName, collectionSchema);

module.exports = Messages;