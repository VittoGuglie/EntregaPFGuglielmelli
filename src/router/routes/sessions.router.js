const { Router } = require('express');
const sessionsController = require('../controllers/sessions.controller.js');

const router = Router();

router.post('/register', sessionsController.registerUser);
router.post('/login', sessionsController.loginUser);

module.exports = router;