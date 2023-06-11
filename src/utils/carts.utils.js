const { v4: uuidv4 } = require('uuid');
const Product = require('../dao/models/Products.model');

function generateUniqueCode() {
    const uniqueCode = uuidv4();
    return uniqueCode;
}

// Calcula el monto total de la compra
function calculateTotalAmount(productsToPurchase) {
    let totalAmount = 0;

    for (const product of productsToPurchase) {
        const price = getProductPrice(product.product);

        const subtotal = price * product.quantity;

        totalAmount += subtotal;
    }

    return totalAmount;
}

// Obtener el precio de un producto desde la base de datos
async function getProductPrice(productsToPurchase) {
    let totalAmount = 0;

    for (const productToPurchase of productsToPurchase) {
        try {
            const productId = productToPurchase.product;
            const quantity = productToPurchase.quantity;

            const product = await Product.findById(productId);

            if (product) {
                const price = product.price;
                const subtotal = price * quantity;
                totalAmount += subtotal;
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    }

    return totalAmount;
}

module.exports = {
    generateUniqueCode,
    calculateTotalAmount,
};