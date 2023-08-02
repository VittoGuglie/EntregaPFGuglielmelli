const express = require('express');
const privateAccess = require('../../middlewares/privateAccess.middleware');
const User = require('../../dao/models/Users.model');
const authorization = require('../../middlewares/authorization.middleware');

const router = express.Router();

router.put('/:uid', privateAccess, authorization(['admin']), async (req, res) => {
    try {
        const uid = req.params.uid;

        const userFound = await User.findById(uid);

        if (!userFound) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userDocumentsComplete = hasRequiredDocuments(userFound);

        if (!userDocumentsComplete) {
            return res.status(400).json({ error: 'El usuario no ha terminado de cargar la documentación requerida' });
        }

        const currentRole = userFound.role;
        const newRole = currentRole === 'user' ? 'premium' : 'user';

        userFound.role = newRole;
        await userFound.save();

        res.json({ message: 'Rol de usuario actualizado correctamente' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
});

module.exports = router;