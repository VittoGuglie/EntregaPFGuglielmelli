const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const router = require('./router');
const { port } = require('./config/app.config')
const mongoConnect = require('../db/index');
const cookieParser = require('cookie-parser');
const { faker } = require('@faker-js/faker');

const passport = require('passport');
const initializePassport = require('./config/passport.config');

const { dbAdmin, dbPassword, dbHost } = require('../src/config/db.config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/files', express.static(__dirname + '/files'));
app.use(cookieParser());
app.use(passport.initialize());

initializePassport();


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

router(app);

mongoConnect();

//Endpoint de prueba de creacion de usuarios con las variables asignadas:
app.get('/api/test/user', (req, res) => {
    let first_name = faker.name.firstName();
    let last_name = faker.name.lastName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    res.send({ first_name, last_name, email, password });
});

const httpServer = app.listen(port, () => {
    console.log(`The server is listening at port ${port}`);
});

const io = new Server(httpServer);

let messages = []; 

io.on('connection', socket => {
    console.log(`Cliente conectado con id: ${socket.id}`);

    socket.on('agregarProducto', product => {
        io.emit('actualizarLista', { product, status: 1, productId: product.id });
    });

    socket.on('newUser', user => {
        socket.broadcast.emit('userConnected', user);
        socket.emit('messageLogs', messages);
    });

    socket.on('message', data => {
        messages.push(data);
        io.emit('messageLogs', messages);
    })
});