function generateMockProducts(quantity){
    const products = [];

    for(let i = 0; i < quantity; i++) {
        const product = {
            title: 'Product Title',
            description: 'This is a generated product',
            price: 9.99,
            code: 'ABC123',
            stock: 25,
            category: 'Electronics',
        };
        products.push(product);
    }
    return products;
}

module.exports = generateMockProducts;