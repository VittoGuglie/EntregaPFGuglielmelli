const User = require('../../dao/models/Users.model');
const crypto = require('crypto');
const transporter = require('../../utils/mail.utils');

exports.solicitarRestablecimiento = async (req, res) => {
    const { email } = req.body;

    try {
        const usuario = await User.findOne({ email });
        if (!usuario) {
            return res.status(404).send('Correo electrónico no encontrado');
        }
        const token = crypto.randomBytes(20).toString('hex');
        usuario.resetToken = token;
        usuario.resetTokenExpiry = Date.now() + 3600000; // 1 hora de expiración
        await usuario.save();

        const resetURL = `http://localhost:8080/reset-password/${token}`;
        await transporter.sendMail({
            to: usuario.email,
            subject: 'Restablecimiento de contraseña',
            html: `Haz clic en el siguiente enlace para restablecer tu contraseña: <a href="${resetURL}">Restablecer Contraseña</a>`
        });

        res.send('Correo de restablecimiento enviado');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al solicitar el restablecimiento de contraseña');
    }
};

exports.validarToken = async (req, res) => {
    const { token } = req.params;

    try {
        const usuario = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!usuario) {
            return res.redirect('/expirado');
        }

        res.redirect(`/reset-password/${token}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al validar el token de restablecimiento');
    }
};

exports.restablecerPass = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const usuario = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });

        if (!usuario) {
            return res.status(404).send('Token de restablecimiento inválido o expirado');
        }
        if (password === usuario.password) {
            return res.status(400).send('No puedes utilizar la misma contraseña anterior');
        }

        usuario.password = password;
        usuario.resetToken = undefined;
        usuario.resetTokenExpiry = undefined;
        await usuario.save();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al restablecer la contraseña');
    }
};