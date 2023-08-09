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
const cron = require('node-cron');
const transporter = require('../../utils/mail.utils');

class UsersRouter extends CustomRouter {
    constructor() {
        super();
        // Ejecutar la limpieza de usuarios inactivos cada día a la medianoche
        cron.schedule('0 0 * * *', async () => {
            try {
                await deleteInactiveUsers();
                console.log('Usuarios inactivos eliminados y correos enviados.');
            } catch (error) {
                console.error('Error al eliminar usuarios inactivos:', error);
            }
        });
    }
    async deleteInactiveUsers() {
        try {
            const currentTime = new Date();
            const inactiveUsers = await User.find({
                lastConnection: { $lt: new Date(currentTime - (2 * 24 * 60 * 60 * 1000)) } // Últimos 2 días
            });

            for (const user of inactiveUsers) {
                await user.remove();

                await transporter.sendMail({
                    from: 'vitgug2001@gmail.com',
                    to: user.email,
                    subject: 'Eliminación de cuenta por inactividad',
                    text: 'Su cuenta ha sido eliminada debido a la inactividad en los últimos 2 días.'
                });
            }
        } catch (error) {
            throw error;
        }
    }

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

        this.get('/admin-users', privateAccess, authToken, authorization(['admin']), async (req, res) => {
            try {
                const users = await getAll();
                res.render('admin-users', { users }); // Renderizar la vista y pasar los datos de los usuarios
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error al obtener usuarios.' });
            }
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

        // Nueva ruta para eliminar usuarios inactivos manualmente
        this.delete('/deleteInactive', privateAccess, authToken, authorization(['admin']), async (req, res) => {
            try {
                await deleteInactiveUsers();
                res.json({ message: 'Usuarios inactivos eliminados y correos enviados.' });
            } catch (error) {
                console.log(error);
                res.status(500).json({ status: 'error', message: 'Error al eliminar usuarios inactivos.' });
            }
        });
    }
}

module.exports = UsersRouter;