const userModel = require('../../dao/models/Users.model');
const { createHash, passwordValidate } = require('../../utils/cryptPassword.utils.js');

const registerUser = async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    console.log(
        `Registrando a ${first_name} ${last_name} de edad ${age}. email: ${email} y pwd: ${password}`
    );

    if (!first_name || !last_name || !email || !password || !age)
        return res.status(400).send({ status: 'error', error: 'Incomplete values' })
    const exists = await userModel.findOne({ email })

    if (exists)
        return res
            .status(400)
            .send({ status: 'error', error: 'User already exists' })

    const hashedPassword = await createHash(password);
    const user = {
        first_name,
        last_name,
        email,
        password: hashedPassword,
        age,
    };
    await userModel.create(user);
    res.send({ status: 'success', message: 'Registered' });
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).send({ status: 'error', error: 'Incomplete values' })

    const user = await userModel.findOne({ email });

    if (!user)
        return res.status(404).send({ status: 'error', error: 'User not found' })

    const isValidPassword = await passwordValidate(user, password);

    if (!isValidPassword)
        return res
            .status(400)
            .send({ status: 'error', error: 'Incorrect password' })
    console.log(`El ingreso de ${email} fue satisfactorio`);
    res.send({ status: 'success', message: 'logged in' });
}

module.exports = {
    loginUser,
    registerUser,
};