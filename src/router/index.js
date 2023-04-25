const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const chatTemplatesController = require('./routes/chatTemplates.router');
const authRouter = require('./routes/auth.router');
const usersRouter = require('./routes/users.router');
const viewsUsersController = require('./routes/viewsUsers.router');

const router = app => {
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/home', viewsRouter);
    app.use('/realTimeProducts', realTimeProductsRouter);
    app.use('/templates', chatTemplatesController);
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/', viewsUsersController);
};

module.exports = router;