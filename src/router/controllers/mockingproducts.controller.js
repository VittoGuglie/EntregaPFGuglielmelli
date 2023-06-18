const { Router } = require('express');
const CustomError = require('../../handlers/errors/CustomError');
const generateProductErrorInfo = require('../../handlers/errors/info');
const EnumErrors = require('../../handlers/errors/EnumError');
const generateMockProducts = require('../../helpers/mockingproducts.generator');

const router = Router();

const products = [];

const productsGenerated = generateMockProducts(100);

router.get('/', (req, res) => {
    res.json(productsGenerated);
});

router.post('/', (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !price) {
        CustomError.createError({
            name: 'Product creation error',
            cause: generateProductErrorInfo({ title, price }),
            message: 'Error trying to create product',
            code: EnumErrors.INVALID_TYPES_ERROR,
        });
    }

    const product = {
        title,
        description,
        price,
        code,
        stock,
        thumbnail: req.file.filename,
        category,
    };

    products.push(product);

    res.json({ message: product });
});

module.exports = router;