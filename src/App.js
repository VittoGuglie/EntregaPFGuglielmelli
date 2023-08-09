const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io')
const router = require('./router');
const { port } = require('./config/app.config')
const mongoConnect = require('../db/index');
const cookieParser = require('cookie-parser');
const { getLogger } = require('./utils/logger.utils');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.yaml');

const passport = require('passport');
const initializePassport = require('./config/passport.config');

const { secret_key } = require('./config/app.config');

const app = express();

app.use(session({
    secret: secret_key,
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use('/files', express.static(__dirname + '/files'));
app.use(cookieParser());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initializePassport();

app.engine('handlebars', handlebars.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

router(app);

mongoConnect();

const specs = swaggerJsdocs(swaggerDocument);
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

//Endpoint de prueba 
app.get('/loggerTest', (req, res) => {
    const logger = getLogger(process.env.NODE_ENV);

    logger.debug('Mensaje de depuración');
    logger.http('Mensaje de solicitud HTTP');
    logger.info('Mensaje de información');
    logger.warning('Mensaje de advertencia');
    logger.error('Mensaje de error');
    logger.fatal('Mensaje fatal');

    res.send('Prueba de logs realizada');
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