const { Router } = require('express');
const fs = require('fs');
const CartDAO = require('../../dao/carts.dao');
const { Schema } = require('mongoose');

const router = Router();

const CART_FILE = "../../files/carrito.json";

const cartDAO = new CartDAO();

let carts = [];

const cartObj = {
    id: Number,
    products: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
        },
    ],
};

const readCartsFile = async () => {
    try {
        const stats = await fs.promises.stat(CART_FILE);

        if (stats.isFile()) {
            const data = await fs.promises.readFile(CART_FILE);
            const carts = JSON.parse(data);
            return carts;
        } else {
            console.error(`${CART_FILE} is not a file`);
        }
    } catch (err) {
        console.error(`Error reading ${CART_FILE}: ${err.message}`);
    }
};

// Endpoint para generar un carrito:
router.post("/", async (req, res) => {
    const cartId = Math.floor(Math.random() * 1000000);

    const newCart = Object.assign({}, cartObj, { id: cartId });

    carts.push(newCart);

    try {
        await fs.promises.writeFile(CART_FILE, JSON.stringify(carts));
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({
                error: "Error al escribir en el archivo",
                message: error.message,
            });
    };
});


// Endpoint para generar un carrito desde la carts.dao
router.post('/', async (req, res) => {
    try {
        const cart = await cartDAO.createCart(req.body);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Endpoint para buscar un carrito específico por su id
router.get('/:cartId', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await cartDAO.findCartById(cartId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Endpoint para agregar un nuevo ítem a un carrito específico
router.put('/:cartId/items', async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const item = req.body;
        const cart = await cartDAO.addItemToCart(cartId, item);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para listar los productos de un carrito:
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await cartDAO.findCartById(cid).populate("products.product");
        res.json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para agregar un producto al carrito:
router.post("/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;

    carts = await readCartsFile();

    const cart = carts.find((c) => c.id === Number(cid
    ));

    if (!cart)
        return res.status(404).json({ error: "Oh Oh... Carrito no encontrado." });

    const pid = req.params.pid;
    const productIndex = cart.products.findIndex(
        (product) => product.id === Number(pid)
    );
    if (productIndex === -1) {
        cart.products.push({ product: pid, quantity: 1 });
    } else {
        const additionalQuantity = 1;
        cart.products[productIndex].quantity += additionalQuantity;
    }

    await fs.promises.writeFile(CART_FILE, JSON.stringify(carts));

    res.json(cart);
});

// Endpoint para eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const cart = await cartDAO.deleteProductFromCart(cartId, productId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const products = req.body;
        const cart = await cartDAO.updateCart(cartId, products);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para actualizar la cantidad de un producto en un carrito específico
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const cart = await cartDAO.updateProductQuantity(cartId, productId, quantity);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para eliminar todos los productos de un carrito específico
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartDAO.deleteCart(cartId);
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para listar los productos de un carrito, incluyendo los detalles de cada producto
router.get('/:cid/products', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartDAO.findCartById(cartId).populate('products.product');
        res.status(200).json(cart.products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
