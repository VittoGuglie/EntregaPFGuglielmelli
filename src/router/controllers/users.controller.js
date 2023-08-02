const CustomRouter = require('../../classes/CustomRouter.class');
const UserDTO = require('../../DTOs/users.dto');
const { createUser, getAll, updateUserRole } = require('../../services/users.services');
const authorization = require('../../middlewares/authorization.middleware');
const publicAccess = require('../../middlewares/publicAccess.middleware');
const privateAccess = require('../../middlewares/privateAccess.middleware');
const User = require('../../dao/models/Users.model');
const generateUsers = require('../../utils/mock.utils')
const { authToken } = require('../../utils/jwt.utils');
const multer = require('multer');

class UsersRouter extends CustomRouter {
    init() {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                if (file.fieldname === 'profile') {
                    cb(null, 'uploads/profiles');
                } else if (file.fieldname === 'product') {
                    cb(null, 'uploads/products');
                } else {
                    cb(null, 'uploads/documents');
                }
            },
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname);
            }
        });
        const upload = multer({ storage });

        // Ruta publica accesible para todos:
        this.get('/', publicAccess, authToken, (req, res) => {
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

        this.get('/getUsersForAdmin', privateAccess, authToken, authorization(['admin']), async (req, res) => {
            try {
                const users = await getAll();
                res.json({ message: users });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
            }
        });

        this.post(
            '/:uid/documents',
            ['PRIVATE'], 
            authToken, 
            upload.array('documents'), 
            async (req, res) => {
                try {
                    const uid = req.params.uid;
                    const documents = req.files.map(file => ({
                        name: file.originalname,
                        reference: file.filename
                    }));

                    const user = await User.findById(uid);

                    if (!user) {
                        return res.status(404).json({ error: 'Usuario no encontrado' });
                    }

                    user.documents = user.documents.concat(documents);

                    await user.save();

                    res.json({ message: 'Documentos subidos exitosamente' });
                } catch (error) {
                    console.log(error);
                    res.sendServerError('Error al subir los documentos');
                }
            }
        );
    }
}

module.exports = UsersRouter;