import fs from 'node:fs/promises';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

class CartManager {
    constructor() {
        this.filePath = path.join(__dirname, '../data/carts.json');
    }

    // Obtener todos los carritos
    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                // Si el archivo no existe, inicializarlo como un array vacío
                await fs.writeFile(this.filePath, JSON.stringify([], null, 2));
                return [];
            } else {
                console.error('Error al leer el archivo carts.json:', err);
                throw new Error('No se pudo leer el archivo de carritos');
            }
        }
    }

    // Crear un nuevo carrito
    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = { id: (carts.length + 1).toString(), products: [] };
            carts.push(newCart);
            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return newCart;
        } catch (err) {
            console.error('Error al crear el carrito:', err);
            throw new Error('No se pudo crear el carrito');
        }
    }

    // Obtener un carrito por su ID
    async getCartById(id) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === id) || null;
        } catch (err) {
            console.error('Error al obtener el carrito:', err);
            throw new Error('No se pudo obtener el carrito');
        }
    }

    // Agregar un producto a un carrito
    async addProductToCart(cartId, productId) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado.`);

            const productInCart = cart.products.find(p => p.product === productId);
            if (productInCart) {
                productInCart.quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Agregar el producto al carrito
            }

            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
            return cart;
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }
}

export default CartManager;