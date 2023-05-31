const { Router } = require('express');
const ProductManager = require('../../dao/ProductManager.dao');
const path = require('path');

const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../../files/products.json'));

router.get('/', async (req, res) => {
    await productManager.readJson();
    const products = productManager.products;

    res.render('realTimeProducts.handlebars', {
        products,
        title: 'Real Time Products'
    });
});

module.exports = router;