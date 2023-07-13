const CustomRouter = require('../../classes/CustomRouter.class');
const { generateToken } = require('../../utils/jwt.utils');
const Users = require('../../dao/models/Users.model');

class AuthRouter extends CustomRouter {
    init() {
        this.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;
                console.log(email);
                console.log(password);

                const user = await Users.findOne({ email });

                if (!user)
                    return res
                        .status(400)
                        .json({ status: 'error', error: "User and password don't match" });

                if (password !== user.password)
                    return res
                        .status(400)
                        .json({ status: 'error', error: "User and password don't match" });

                const access_token = generateToken({ email, role: user.role });

                res
                    .cookie('authToken', access_token, {
                        maxAge: 60 * 60 * 1000,
                        httpOnly: true,
                    }).json({
                        status: 'success',
                        message: 'Session initialized, authToken: ' + access_token,
                    });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', error: 'Internal server error' });
            }
        });
    };
};

module.exports = AuthRouter;