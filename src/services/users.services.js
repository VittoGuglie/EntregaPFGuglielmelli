const EntityDAO = require('../dao/mongo/Entity.dao.js');
const message = require('../repositories/message.repository.js');
const User = require('../dao/models/Users.model.js');

const Users = new EntityDAO('Users');

const getAll = async () => {
    try {
        return await Users.getAll();
    } catch (error) {
        throw error;
    }
};

const createUser = async newUserInfo => {
    try {
        const newUser = await Users.create(newUserInfo);

        await message.send(newUserInfo);

        return newUser;
    } catch (error) {
        throw error;
    }
};

const updateUserRole = async (userId, role) => {
    try {
        const usuario = await User.findById(userId);

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        usuario.role = role;

        await usuario.save();
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAll,
    createUser,
    updateUserRole
};