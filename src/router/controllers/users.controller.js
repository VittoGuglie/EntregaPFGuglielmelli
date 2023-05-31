const passport = require('passport');
const CustomRouter = require('../../classes/CustomRouter.class')

class UsersRouter extends CustomRouter {
    init() {
        this.post('/register', ['PUBLIC'], passport.authenticate('register', { failureRedirect: '/failregister' }), async (req, res) => {
            res.sendCreatedSuccess('Usuario registrado');
        });
        this.get('/failregister', ['PUBLIC'], async (req, res) => {
            console.log('failed strategy');
            res.sendUserError('Failed');
        });
    }
}

module.exports = UsersRouter;