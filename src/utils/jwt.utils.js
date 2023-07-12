const jwt = require('jsonwebtoken');
const { secret_key } = require('../config/app.config');

const generateToken = user => {
    const token = jwt.sign(user, secret_key, { expiresIn: '60s' });
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secret_key);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

module.exports = {
    generateToken,
    verifyToken,
};