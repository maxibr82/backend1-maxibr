import fs from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/carts.json');
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = { id: (carts.length + 1).toString(), products: [] };
        carts.push(newCart);
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === id) || null;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === cartId);
        if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado.`);

        const productInCart = cart.products.find(p => p.product === productId);
        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
        return cart;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error al leer el archivo carts.json:', err);
            return [];
        }
    }
}

export default CartManager;