const mongoose = require('mongoose');

const collectionName = 'user';

const collectionSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;