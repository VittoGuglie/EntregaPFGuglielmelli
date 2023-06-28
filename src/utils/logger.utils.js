const winston = require('winston');
const chalk = require('chalk').default;

// Configuración de niveles
const levels = {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
};

// Transportador para escribir en un archivo 'errors.log'
const fileTransport = new winston.transports.File({
    filename: 'errors.log',
    level: 'error'
});

// Configuración del logger de desarrollo
const developmentLogger = winston.createLogger({
    level: 'debug',
    levels,
    format: winston.format.combine(
        winston.format.printf(({ level, message }) => {
            const colorizedLevel = chalk.keyword(getColor(level))(level.toUpperCase());
            return `${colorizedLevel}: ${message}`;
        })
    ),
    transports: [new winston.transports.Console()]
});

// Configuración del logger de producción
const productionLogger = winston.createLogger({
    level: 'info',
    levels,
    format: winston.format.json(),
    transports: [fileTransport]
});

// Función para obtener el logger según el entorno
function getLogger(env) {
    return env === 'production' ? productionLogger : developmentLogger;
}

// Función auxiliar para obtener el color según el nivel
function getColor(level) {
    switch (level) {
        case 'fatal':
        case 'error':
            return 'red';
        case 'warning':
            return 'yellow';
        case 'info':
            return 'green';
        case 'http':
            return 'blue';
        case 'debug':
            return 'gray';
        default:
            return 'white';
    }
}

module.exports = { getLogger };