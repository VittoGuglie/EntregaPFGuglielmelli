class ProductManager {
    constructor(){
        this.products = [];
        this.nextCode = 1;
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

    getProducts(){
        return this.products;
    }

    getProductById(productId){
        const foundProduct = this.products.find(product => product.id === productId);
        if (foundProduct){
            return foundProduct;
        } else {
            console.log('Not found');
        }
    }
}