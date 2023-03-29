const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const router = require('./router');
const ProductManager = require('./ProductManager');

const productManager = new ProductManager(__dirname, './files/products.json');

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/files', express.static(__dirname + '/files'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');


router(app);

const httpServer = app.listen(port, () => {
    console.log(`The server is listening at port ${port}`);
});

const io = new Server(httpServer);

let products = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.emit('products', products);

    // Evento de agregar producto
    const generateId = () => Date.now().toString();

    socket.on('agregarProducto', product => {
        product.id = generateId();
        products.push(product);
        console.log('Producto recibido:', product);
        io.emit('actualizarLista', { product, status: 1, productId: product.id });
    });

    // Evento de eliminar producto
    socket.on('eliminarProducto', async (productId) => {
        const deleted = await productManager.remove(productId);

        if (deleted) {
            io.emit('productDeleted', productId);
        }
    });
});