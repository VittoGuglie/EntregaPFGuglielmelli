const authorization = roles => {
    return async (req, res, next) => {
        if (!req.user || typeof req.user !== 'object' || !req.user._id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden!!!' });
        }

        next();
    };
};

module.exports = authorization;