const { Router } = require('express');
const passport = require('passport');

const router = Router();

router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
    res.send({status: 'success', message: 'Usuario registrado'});
});

router.get('/failregister', async (req, res) => {
    console.log('failed strategy');
    res.send({error: 'Failed'});
});

module.exports = router;