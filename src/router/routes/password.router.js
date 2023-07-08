const { Router } = require('express');
const passwordController = require('../controllers/password.controller');

const router = Router();

router.post('/', passwordController.solicitarRestablecimiento);

router.get('/:token', passwordController.validarToken);
router.post('/:token', passwordController.restablecerPass);

module.exports = router;
