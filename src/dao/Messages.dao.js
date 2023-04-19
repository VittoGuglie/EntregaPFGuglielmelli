const messagesModel = require('./models/Messages.model');

function saveMessage(user, message) {
    const newMessage = new messagesModel({ user, message });
    newMessage.save((err, result) => {
        if (err) {
            console.log("Error al guardar el mensaje", err);
            return;
        }
        console.log("Mensaje guardado con éxito");
    });
}

module.exports = {
    saveMessage: saveMessage
};