const products = require('./models/Products.model')

class productsDao {
    constructor() { }

    async findAll() {
        try {
            return await products.find()
        } catch (error) {
            return error
        }
    }

    async insertMany(newProductsInfo) {
        try {
            return await products.insertMany(newProductsInfo)
        } catch (error) {
            return error
        }
    }

    async create(newProductInfo) {
        try {
            return await products.create(newProductInfo)
        } catch (error) {
            return
        }
    }

    async deleteAll() {
        return await products.deleteMany()
    }
}

module.exports = productsDao