const chai = require('chai');
const supertest = require('supertest');
const app = require('../App');

const expect = chai.expect;
const api = supertest(app);

// Bloque de pruebas para el endpoint de generar un carrito
describe('POST /carts', () => {
    it('Debería generar un nuevo carrito con estado 201', async () => {
        const response = await api.post('/carts');
        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
        expect(response.body).to.have.property('products').to.be.an('array');
    });
});

// Bloque de pruebas para el endpoint de agregar un producto al carrito
describe('POST /carts/:cid/product/:pid', () => {
    it('Debería agregar un producto al carrito con estado 200', async () => {
        const cid = 1; 
        const pid = 1; 

        const response = await api.post(`/carts/${cid}/product/${pid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id', cid);
        expect(response.body).to.have.property('products').to.be.an('array');
    });

    it('Debería devolver un mensaje de error con estado 404 si el carrito no existe', async () => {
        const nonExistingCartId = 999; 
        const pid = 1; 

        const response = await api.post(`/carts/${nonExistingCartId}/product/${pid}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});

// Bloque de pruebas para el endpoint de listar los productos de un carrito
describe('GET /carts/:cid', () => {
    it('Debería devolver los productos de un carrito con estado 200', async () => {
        const cid = 1;

        const response = await api.get(`/carts/${cid}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('Debería devolver un mensaje de error con estado 500 si hay un problema al obtener los productos', async () => {
        const invalidCartId = 'invalid';

        const response = await api.get(`/carts/${invalidCartId}`);
        expect(response.status).to.equal(500);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});