const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/carts.json');

class CartManager {
    constructor() {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([]));
        }
    }

    async getCarts() {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id);
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: (carts.length + 1).toString(), products: [] };
        carts.push(newCart);
        await fs.promises.writeFile(filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) return null;

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.promises.writeFile(filePath, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager;