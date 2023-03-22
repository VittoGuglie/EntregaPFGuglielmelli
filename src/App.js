const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const router = require('./router');

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

router(app);

const httpServer = app.listen(port, () => {
    console.log(`The server is listening at port ${port}`);
});

const io = new Server(httpServer);

io.on('connection', socket => {
    console.log('Cliente conectado');

    socket.on('agregarProducto', product => {
        io.emit('actualizarLista', { product, status: 1 });
    });
    socket.on('eliminarProducto', (product) => {
        io.emit('actualizarListaDeProductos', product);
    });
});