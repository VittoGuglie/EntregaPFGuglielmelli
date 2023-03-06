const express = require('express');
const fs = require('fs');
const products = require('../files/products.json');
const ProductManager = require('./ProductManager');

const port = 8080;
const app = express();

// Endpoint para obtener todos los productos o un limite de ellos:
app.get('/products', async (req, res) => {
    const limit = req.query.limit;
    try {
        const products = await readProductsFromFile();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los productos');
    }
});

async function readProductsFromFile() {
    return new Promise((resolve, reject) => {
        fs.readFile('../files/products.json', 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Endpoint para btener producto por id:
app.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid;
    try {
        const products = await readProductsFromFile();
        const product = products.find((product) => product.id == pid);
        if (product) {
            res.json(product);
        } else {
            res.send(`El producto con id ${pid} no existe.`);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los productos');
    }
});

app.listen(port, () => {
    console.log(`The server is listening at port ${port}`);
})