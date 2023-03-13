const { Router } = require("express");
const fs = require("fs");

const router = Router();

const CART_FILE = "./files/carrito.json";

let carts = [];

const cartObj = {
    id: Number,
    products: [
        {
            product: Number,
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
    }
});

// Endpoint para listar los productos de un carrito:
router.get("/:cid", async (req, res) => {
    const cid = req.params.cid;

    carts = await readCartsFile();

    const cart = carts.find((c) => c.id === Number(cid));

    if (!cart) return res.status(404).json({ error: "Oh Oh... Carrito no encontrado." });

    res.json(cart.products);
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

module.exports = router;
