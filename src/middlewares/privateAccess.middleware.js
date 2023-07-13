const privateAccess = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: 'error', error: 'Not authenticated' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, secret_key, (error, credentials) => {
        if (error) {
            return res.status(403).json({ status: 'error', error: 'Forbidden' });
        }

        req.user = credentials.user;
        next();
    });
};

module.exports = privateAccess;