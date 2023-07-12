const passport = require('passport');
const CustomRouter = require('../../classes/CustomRouter.class');
const UserDTO = require('../../DTOs/users.dto');
const { createUser, getAll, updateUserRole } = require('../../services/users.services');
const authorization = require('../../middlewares/authorization.middleware');
const publicAccess = require('../../middlewares/publicAccess.middleware');
const privateAccess = require('../../middlewares/privateAccess.middleware');
const User = require('../../dao/models/Users.model');
const generateUsers = require('../../utils/mock.utils')

class UsersRouter extends CustomRouter {
    init() {
        // Ruta publica accesible para todos:
        this.get('/', publicAccess, (req, res) => {
            const { users } = req.query;
            const userMock = generateUsers(users);
            res.json({ message: userMock });
        });

        this.post(
            '/register',
            ['PUBLIC'],
            async (req, res) => {
                try {
                    const newUserInfo = new UserDTO(req.body);
                    const newUser = await createUser(newUserInfo);
                    res.sendCreatedSuccess(newUser);
                } catch (error) {
                    console.log(error);
                    res.sendServerError('Error al registrar usuario');
                }
            }
        );

        this.get('/getUsersForAdmin', privateAccess, authorization(['admin']), async (req, res) => {
            try {
                const users = await getAll();
                res.json({ message: users });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });

        // this.patch('/premium/:userId', [authorization('admin')], async (req, res) => {
        //     try {
        //         const { userId } = req.params;
        //         const { role } = req.body;

        //         await updateUserRole(userId, role);

        //         res.json({ message: 'Rol de usuario actualizado correctamente' });
        //     } catch (error) {
        //         console.log(error);
        //         res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        //     }
        // });

        this.patch('/premium/:uid', privateAccess, authorization(['admin']), async (req, res) => {
            const { uid } = req.params;
            console.log(uid);
            try {
                const user = await User.findById(uid);
                if (!user) {
                    return res.status(404).json({ error: 'Usuario no encontrado' });
                }

                const currentRole = user.role;
                const newRole = currentRole === 'user' ? 'premium' : 'user';

                user.role = newRole;
                await user.save();

                res.json({ message: 'Rol de usuario actualizado correctamente' });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });
    }
}

module.exports = UsersRouter;