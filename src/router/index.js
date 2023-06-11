const productsRouter = require('./controllers/products.controller');
const cartsRouter = require('./controllers/carts.controller');
const viewsProductsRouter = require('./controllers/viewsProducts.controller');
const realTimeProductsRouter = require('./controllers/realTimeProducts.controller');
const chatTemplatesRouter = require('./controllers/chatTemplates.controller');
const AuthRouter = require('./controllers/auth.controller');
const UsersRouter = require('./controllers/users.controller');
const viewsUsersController = require('./controllers/viewsUsers.controller');
const currentController = require('./controllers/current.controller');

const usersRouter = new UsersRouter();
const authRouter = new AuthRouter();

const router = app => {
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/home', viewsProductsRouter);
    app.use('/realTimeProducts', realTimeProductsRouter);
    app.use('/templates', chatTemplatesRouter);
    app.use('/auth', authRouter.getRouter());
    app.use('/users', usersRouter.getRouter());
    app.use('/', viewsUsersController);
    app.use('/current', currentController);
    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Ooops Page not found' })
    });
};

module.exports = router;