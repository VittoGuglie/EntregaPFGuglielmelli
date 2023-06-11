const transport = require('../utils/mail.util')

class MailAdapter {
    async send(newUserInfo) {
        await transport.sendMail({
            from: 'coder51120@gmail.com',
            to: newUserInfo.email,
            subject: `Hola ${newUserInfo.name}, bienvenido a la plataforma`,
            html: `
        <div>
            <h1>En hora buena por registarte!</h1>
        </div>
        `,
        });
    };
};

module.exports = MailAdapter;