const { Router } = require('express');
const ProductManager = require('../../ProductManager.js');

const router = Router();

router.get('/', async (req, res) => {
    const productManager = new ProductManager('./files/products.json');
    await productManager.readJson();
    const products = productManager.products;
    res.render('realTimeProducts.handlebars', {
        products,
        title: 'Real Time Products'
    });
});

module.exports = router;