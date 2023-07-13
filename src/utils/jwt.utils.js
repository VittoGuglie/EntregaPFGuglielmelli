const jwt = require('jsonwebtoken');
const { secret_key } = require('../config/app.config');

const generateToken = user => {
    const token = jwt.sign(user, secret_key, { expiresIn: '300s' }); // El token expira en 5 minutos

    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ status: 'error', error: 'Not authenticated' });
    
    const token = authHeader.split(' ')[1];

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret_key, (error, credentials) => {
            if (error)
                return reject(error);

            req.user = credentials.user;
            resolve();
        });
    })
    .then(() => next())
    .catch(error => res.status(403).json({ status: 'error', error: 'Forbidden' }));
};

module.exports = {
    generateToken,
    authToken,
};
