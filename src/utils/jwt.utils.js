const jwt = require('jsonwebtoken');

const generateSecretKey = () => {
    const length = 32;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

    let secretKey = '';

    for (let i = 0; i < length; i++) {
        secretKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return secretKey;
};

const SECRET_KEY = generateSecretKey();

const generateToken = user => {
    const token = jwt.sign(user, PRIVATE_KEY, { expiresIn: '60s' });

    return token;
}

const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ status: 'error', error: 'Not authenticated' });

    const token = authHeader.split(' ')[1];

    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error)
            return res.status(403).json({ status: 'error', error: 'Forbiden' });

        req.user = credentials.user;
        next();
    });
};

module.exports = {
    generateToken,
    authToken,
    SECRET_KEY
};