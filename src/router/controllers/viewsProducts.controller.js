const { Router } = require('express');
const { paginate } = require('paginate-info');
const ProductManager = require('../../dao/ProductManager.dao');
const CartManager = require('../../dao/carts.dao');

const cartDAO = new CartManager();

const router = Router(); 

router.get('/', async (req, res) => {
    const productManager = new ProductManager('../files/products.json');
    await productManager.readJson();
    const products = productManager.products;

    const currentPage = req.query.page || 1;
    const perPage = 10;
    const paginatedProducts = paginate(products.length, currentPage, perPage);

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const productsToShow = products.slice(startIndex, endIndex);

    res.render('home.handlebars', {
        products: productsToShow,
        pagination: paginatedProducts,
        title: 'Lista de productos'
    });
});

router.get('/:productId', async (req, res) => {
    const productManager = new ProductManager('../files/products.json');
    await productManager.readJson();
    const product = productManager.getProductById(req.params.productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }
    res.render('product-detail.handlebars', {
        product,
        title: product.title
    });
});

router.post('/:cid/add-to-cart', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.body.productId;
    const product = await productManager.getProductById(productId);

    const item = {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
    };
    
    await cartDAO.addItemToCart(cartId, item);

    res.redirect(`/carts/${cartId}`);
});

router.get('/:cid', async (req, res) => {
    const cartManager = new CartManager('../files/carts.json');
    const productManager = new ProductManager('../files/products.json');

    const cartId = req.params.cid;
    const cart = await cartManager.getCart(cartId);

    if (!cart) {
        return res.status(404).send('El carrito solicitado no existe');
    }

    const cartProducts = await productManager.getProductsByIds(cart.products);
    const total = cartProducts.reduce((acc, cur) => acc + cur.price, 0);

    res.render('cart.handlebars', {
        cartId: cart.id,
        products: cartProducts,
        total: total,
        title: `Carrito #${cart.id}`
    });
});

module.exports = router;
