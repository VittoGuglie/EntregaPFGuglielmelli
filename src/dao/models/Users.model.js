const mongoose = require('mongoose');
const { Schema } = mongoose;

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
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    },
    role: {
        type: String,
        default: 'User',
        enum: ['User', 'Admin']
    }
});

const Users = mongoose.model(collectionName, collectionSchema);

module.exports = Users;