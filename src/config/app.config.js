const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 8080,
    environment: process.env.NODE_ENV,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
    secret_key: process.env.SECRET_KEY,
};