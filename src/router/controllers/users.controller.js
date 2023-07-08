const passport = require('passport');
const CustomRouter = require('../../classes/CustomRouter.class');
const UserDTO = require('../../DTOs/users.dto');
const { createUser, getAll, updateUserRole } = require('../../services/users.services');
const authorization = require('../../middlewares/authorization.middleware');
const User = require('../../dao/models/Users.model');

class UsersRouter extends CustomRouter {
    init() {
        this.post(
            '/register',
            ['PUBLIC'],
            passport.authenticate('register', { failureRedirect: '/failregister' }),
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

        this.get('/failregister', ['PUBLIC'], async (req, res) => {
            console.log('failed strategy');
            res.sendUserError('Failed');
        });

        this.get('/', [authorization('admin')], async (req, res) => {
            try {
                const users = await getAll();
                res.json({ message: users });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });

        this.patch('/premium/:userId', [authorization('admin')], async (req, res) => {
            try {
                const { userId } = req.params;
                const { role } = req.body;

                await updateUserRole(userId, role);

                res.json({ message: 'Rol de usuario actualizado correctamente' });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });

        this.patch('/premium/:uid', [authorization('admin')], async (req, res) => {
            const { uid } = req.params;
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