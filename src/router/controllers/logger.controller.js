const { Router } = require('express');
const { getLogger } = require('../../utils/logger.utils');

const router = Router();
const logger = getLogger(process.env.NODE_ENV);

// Ruta /loggerTest para probar los logs
router.get('/', (req, res) => {
    logger.debug('Mensaje de depuración');
    logger.http('Mensaje de solicitud HTTP');
    logger.info('Mensaje de información');
    logger.warning('Mensaje de advertencia');
    logger.error('Mensaje de error');
    logger.fatal('Mensaje fatal');

    res.send('Prueba de logs realizada');
});

module.exports = router;