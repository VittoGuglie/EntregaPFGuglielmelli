const Cart = require('./models/Carts.model');

class CartDAO {
    async createCart(cart) {
        try {
            const newCart = new Cart(cart);
            const savedCart = await newCart.save();
            return savedCart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async findCartById(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            return cart;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addItemToCart(cartId, item) {
        try {
            const cart = await Cart.findById(cartId);
            cart.items.push(item);
            const savedCart = await cart.save();
            return savedCart;
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = CartDAO;



