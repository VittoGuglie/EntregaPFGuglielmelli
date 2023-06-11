const passport = require('passport');
const CustomRouter = require('../../classes/CustomRouter.class');
const UserDTO = require('../../DTOs/users.dto');
const { createUser, getAll } = require('../../services/users.services');
const authorization = require('../../middlewares/authorization.middleware');

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
    }
}

module.exports = UsersRouter;