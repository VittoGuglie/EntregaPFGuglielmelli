const { Router } = require('express');
const ProductManager = require('../../dao/ProductManager.dao');

const router = Router(); 

router.get('/', async (req, res) => {
    const productManager = new ProductManager('./files/products.json');
    await productManager.readJson();
    const products = productManager.products;
    console.log(products);
    res.render('home.handlebars', {
        products,
        title: 'Lista de productos'
    });
});

module.exports = router;