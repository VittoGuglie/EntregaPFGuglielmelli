const mongoose = require('mongoose');

const collectionName = 'session';

const collectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 60 * 60 * 24 // La sesión expira después de 24 horas
    }
});

const Sessions = mongoose.model(collectionName, collectionSchema);

module.exports = Sessions;