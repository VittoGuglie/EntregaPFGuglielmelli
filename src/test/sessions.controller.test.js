const chai = require('chai');
const supertest = require('supertest');
const app = require('../App');
const userModel = require('../dao/models/Users.model');

const expect = chai.expect;
const api = supertest(app);

// Bloque de pruebas para la función de registro de usuarios (registerUser)
describe('POST /register', () => {
    it('Debería registrar un nuevo usuario con estado 200', async () => {
        const newUser = {
            first_name: 'Felix',
            last_name: 'Katito',
            email: 'felix@example.com',
            password: 'password123',
            age: 7,
        };

        const response = await api.post('/register').send(newUser);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('message', 'Registered');
    });

    it('Debería devolver un mensaje de error con estado 400 si faltan datos en el registro', async () => {
        const incompleteUser = {
            first_name: 'John',
            age: 65,
        };

        const response = await api.post('/register').send(incompleteUser);
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error', 'Incomplete values');
    });

    it('Debería devolver un mensaje de error con estado 400 si el usuario ya existe', async () => {
        const existingUser = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            age: 30,
        };

        await userModel.create(existingUser);

        const response = await api.post('/register').send(existingUser);
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error', 'User already exists');
    });
});

// Bloque de pruebas para la función de inicio de sesión de usuarios (loginUser)
describe('POST /login', () => {
    it('Debería iniciar sesión correctamente con estado 200', async () => {
        const validCredentials = {
            email: 'john.doe@example.com',
            password: 'password123',
        };

        const hashedPassword = await createHash(validCredentials.password);
        const user = {
            first_name: 'John',
            last_name: 'Doe',
            email: validCredentials.email,
            password: hashedPassword,
            age: 30,
        };
        await userModel.create(user);

        const response = await api.post('/login').send(validCredentials);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('message', 'logged in');
    });

    it('Debería devolver un mensaje de error con estado 400 si faltan datos en el inicio de sesión', async () => {
        const incompleteCredentials = {
            email: 'john.doe@example.com',
        };

        const response = await api.post('/login').send(incompleteCredentials);
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error', 'Incomplete values');
    });

    it('Debería devolver un mensaje de error con estado 404 si el usuario no existe', async () => {
        const nonExistingCredentials = {
            email: 'nonexisting@example.com',
            password: 'password123',
        };

        const response = await api.post('/login').send(nonExistingCredentials);
        expect(response.status).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error', 'User not found');
    });

    it('Debería devolver un mensaje de error con estado 400 si la contraseña es incorrecta', async () => {
        const validCredentials = {
            email: 'john.doe@example.com',
            password: 'password123',
        };

        const hashedPassword = await createHash(validCredentials.password);
        const user = {
            first_name: 'John',
            last_name: 'Doe',
            email: validCredentials.email,
            password: hashedPassword,
            age: 30,
        };
        await userModel.create(user);

        const incorrectPassword = 'incorrectpassword';

        const response = await api.post('/login').send({
            email: validCredentials.email,
            password: incorrectPassword,
        });
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'error');
        expect(response.body).to.have.property('error', 'Incorrect password');
    });
});