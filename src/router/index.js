const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter = require('./routes/views.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');

const router = app => {
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/home', viewsRouter);
    app.use('/realTimeProducts', realTimeProductsRouter);
}

module.exports = router;