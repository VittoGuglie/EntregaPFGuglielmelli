const MessageRepository = require('./message.repository');
const MessageAdapter = require('./factory');

const message = new MessageRepository(MessageAdapter);

module.exports = message;