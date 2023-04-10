const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const router = require('./router');
const { port } = require('./config/app.config')
const mongoConnect = require('../db/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/files', express.static(__dirname + '/files'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

router(app);

mongoConnect();

const httpServer = app.listen(port, () => {
    console.log(`The server is listening at port ${port}`);
});

const io = new Server(httpServer);

let products = [];

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('agregarProducto', product => {
        io.emit('actualizarLista', { product, status: 1, productId: product.id });
    });
});