const fs = require('fs');

class ProductManager {
    constructor(path){
        this.products = [];
        this.nextId = 1;
        this.path = path;
    }

    addProduct(title, description, price, thumbnail, code, stock){
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error('Todos los campos del producto son obligatorios');
        }
        if (this.products.some(prod => prod.code === code)) {
            throw new Error(`El código de ${title} (code: ${code}) ya existe. Prueba usando otro código`);
        }
        const newProduct = { 
            id: this.nextId++,
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock 
        };
        this.products.push(newProduct);
        return newProduct;
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = data.split("\n");
            this.products = products;
            return this.products;
        } catch (err) {
            console.error(err);
        }
    }

    async getProductById(productId) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = data.split('\n');
            const product = products.find(product => {
                const productData = product.split(',');
                return productData[0] === productId;
            });
            if(product) {
                const productData = product.split(',');
                return {
                    id: productData[0],
                    title: productData[1], 
                    description: productData[2], 
                    price: productData[3], 
                    thumbnail: productData[4], 
                    code: productData[5], 
                    stock: productData[6] 
                }
            } else {
                console.log('No se encontró ningún producto con tal id');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, newProductData) {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = data.split('\n');
            const productIndex = products.findIndex((product) => {
                const productData = product.split(',');
                return productData[0] === id;
            });
            if (productIndex !== -1) {
                const oldProductData = products[productIndex].split(',');
                const newProductDataArray = Object.values(newProductData);
                const updatedProductData = oldProductData.map((value, index) =>
                index === 0 ? value : newProductDataArray[index - 1]
            );
                products[productIndex] = updatedProductData.join(',');
                await fs.promises.writeFile(this.path, products.join('\n'), 'utf-8');
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
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const products = data.split('\n');
            const productIndex = products.findIndex((product) => {
            const productData = product.split(',');
            return productData[0] === id;
            });
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, products.join('\n'), 'utf-8');
                console.log(`El producto con id ${id} ha sido eliminado.`);
            }else{
                console.log(`No se encontró ningún producto con el id ${id}.`);
            }
        } catch (error) {
            console.error(error);
        }
    }
}