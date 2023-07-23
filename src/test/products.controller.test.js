const chai = require('chai');
const supertest = require('supertest');
const app = require('../App');

const expect = chai.expect;
const api = supertest(app);

// Bloque de pruebas para el endpoint de obtener todos los productos
describe('GET /products', () => {
    it('Debería devolver una lista de productos con estado 200', async () => {
        const response = await api.get('/products');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('status', 'success');
        expect(response.body).to.have.property('payload');
        expect(response.body.payload).to.be.an('array');
    });
});

// Bloque de pruebas para el endpoint de obtener un producto por su ID
describe('GET /products/:pid', () => {
    it('Debería devolver un producto específico con estado 200', async () => {
        const productId = 1;
        const response = await api.get(`/products/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('title');
        expect(response.body).to.have.property('description');
    });

    it('Debería devolver un mensaje de error con estado 404 si el producto no existe', async () => {
        const nonExistingProductId = 999;
        const response = await api.get(`/products/${nonExistingProductId}`);
        expect(response.status).to.equal(404);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('error');
    });
});

// Bloque de pruebas para el endpoint de agregar un nuevo producto
describe('POST /products', () => {
    it('Debería agregar un nuevo producto con estado 200', async () => {
        const newProduct = {
            title: 'Nuevo Producto',
            description: 'Descripción del nuevo producto',
            code: 'NP001',
            price: 19.99,
            stock: 100,
            category: 'Nueva Categoría',
        };

        const response = await api.post('/products').send(newProduct);
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id');
    });

    it('Debería devolver un mensaje de error con estado 400 si faltan campos obligatorios', async () => {
        const invalidProduct = {
            title: 'Producto inválido',
            description: 'Descripción del producto inválido',
            price: 25.99,
        };

        const response = await api.post('/products').send(invalidProduct);
        expect(response.status).to.equal(400);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message', 'Oops! Faltan campos obligatorios');
    });
});