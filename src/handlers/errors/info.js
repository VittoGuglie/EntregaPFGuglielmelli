const generateProductErrorInfo = product => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    title: needs to be a string, received: ${product.title}
    price: needs to be a number, received: ${product.price}
    `
}

module.exports = generateProductErrorInfo;