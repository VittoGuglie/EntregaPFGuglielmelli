const dictionaryController = require('../controller/dictionary.controller');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/viewsProducts.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const chatTemplatesController = require('./routes/chatTemplates.router');
const AuthRouter = require('./routes/auth.router');
const UsersRouter = require('./routes/users.router');
const viewsUsersController = require('./routes/viewsUsers.router');

const usersRouter = new UsersRouter();
const authRouter = new AuthRouter();

const router = app => {
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/home', viewsRouter);
    app.use('/realTimeProducts', realTimeProductsRouter);
    app.use('/templates', chatTemplatesController);
    app.use('/auth', authRouter.getRouter());
    app.use('/users', usersRouter.getRouter());
    app.use('/', viewsUsersController);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Ooops Page not found' })
    });
};

module.exports = router;