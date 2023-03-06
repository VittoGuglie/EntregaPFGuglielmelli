const fs = require('fs');

class ProductManager {
    constructor(path){
        this.products = [];
        this.nextId = 1;
        this.path = path;
    }

    async addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos del producto son obligatorios');
        }
        if (this.products.some(prod => prod.code === code)) {
            throw new Error(`El código de ${title} (code: ${code}) ya existe. Prueba usando otro código`);
        }
        const newProduct = { 
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock 
        };
        await this.readJson();

        this.nextId = this.products.length + 1;

        newProduct.id = this.nextId;

        this.products.push(newProduct);
        try {
            fs.writeFile(this.path, JSON.stringify(this.products));
        } catch (error) {
            console.log(error);
        }
    }

    async readJson(){
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = JSON.parse(data)
            this.products = products;
        } catch (error) {
            console.log(error);
        }
    }

    async getProducts() {
        try {
            await this.readJson();
            return this.products;
        } catch (err) {
            console.error(err);
        }
    }

    async getProductById(productId) {
        try {
            await this.readJson();
            const product = this.products.find(product => product.id === productId);
            if(product) {
                return product;
            } else {
                console.log(`No se encontró ningún producto con el id ${productId}.`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, newProductData) {
        try {
            await this.readJson();
            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                const updatedProduct = { id, ...newProductData };
                this.products[productIndex] = updatedProduct;
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                console.log(`El producto con id ${id} ha sido actualizado.`);
            } else {
                console.log(`No se encontró ningún producto con el id ${id}.`);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async deleteProduct(id) {
        try {
            await this.readJson();
            const productIndex = this.products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(this.products));
                console.log(`El producto con id ${id} ha sido eliminado.`);
            }else{
                console.log(`No se encontró ningún producto con el id ${id}.`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = ProductManager;