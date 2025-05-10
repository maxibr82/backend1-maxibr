import Cart from '../models/Cart.js';

class CartManager {
    // Crear un carrito vacío
    async createCart() {
        try {
            const newCart = await Cart.create({ products: [] });
            return newCart;
        } catch (err) {
            console.error('Error al crear el carrito:', err.message);
            throw new Error('No se pudo crear el carrito');
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (productInCart) {
                productInCart.quantity += 1; // Incrementar la cantidad si el producto ya está en el carrito
            } else {
                cart.products.push({ product: productId, quantity: 1 }); // Agregar el producto al carrito
            }

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err.message);
            throw new Error('No se pudo agregar el producto al carrito');
        }
    }

    // Vaciar un carrito
    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

            cart.products = []; // Eliminar todos los productos del carrito
            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al vaciar el carrito:', err.message);
            throw new Error('No se pudo vaciar el carrito');
        }
    }

    // Eliminar un producto específico del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

            cart.products = cart.products.filter(p => p.product.toString() !== productId); // Eliminar el producto
            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al eliminar el producto del carrito:', err.message);
            throw new Error('No se pudo eliminar el producto del carrito');
        }
    }

    // Actualizar todos los productos del carrito
    async updateCartProducts(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

            cart.products = products; // Reemplazar los productos del carrito
            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error al actualizar los productos del carrito:', err.message);
            throw new Error('No se pudieron actualizar los productos del carrito');
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) throw new Error(`Carrito con ID ${cartId} no encontrado`);

            const productInCart = cart.products.find(p => p.product.toString() === productId);
            if (!productInCart) throw new Error(`Producto con ID ${productId} no encontrado en el carrito`);

            productInCart.quantity = quantity; // Actualizar la cantidad del producto
            await cart.save();

            return cart;
        } catch (err) {
            console.error('Error al actualizar la cantidad del producto en el carrito:', err.message);
            throw new Error('No se pudo actualizar la cantidad del producto en el carrito');
        }
    }
}

export default CartManager;