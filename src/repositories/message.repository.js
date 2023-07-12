const nodemailer = require('nodemailer');
const { email, password } = require('dotenv').config();

class MessageRepository {
    async send(newUserInfo) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: email,
                pass: password,
            },
        });

        // Opciones del correo electrónico
        async function main() {
            const info = await transporter.sendMail({
                from: email,
                to: newUserInfo.email,
                subject: 'Registro exitoso',
                text: 'Hola ' + newUserInfo.first_name + ', tu registro ha sido exitoso.',
                html: '<h2>Mensaje enviado a su correo electronico! Bienvenide!</h2>',
            });
            console.log("Message sent to: " + info.messageId);
        }


        main().catch(console.error);
    }
}

module.exports = new MessageRepository();