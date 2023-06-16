const { Router } = require('express');
const jwt = require('passport-jwt');
const { SECRET_KEY } = require('../../utils/jwt.utils');

const router = Router();

router.get('/', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No se proporcionó un token' });
    }

    try {
        const payload = jwt.verify(token, SECRET_KEY);
        const userDTO = {
            id: payload.id,
            username: payload.username,
            email: payload.email,
        };

        res.json(userDTO);
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
});

module.exports = router;