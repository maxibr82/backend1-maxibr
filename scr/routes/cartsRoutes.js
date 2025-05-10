import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); // Crear un carrito vacío
        res.status(201).json({ status: 'success', cart: newCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al crear el carrito', error: err.message });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al agregar el producto al carrito', error: err.message });
    }
});

// Vaciar un carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const clearedCart = await cartManager.clearCart(cid);
        res.status(200).json({ status: 'success', cart: clearedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al vaciar el carrito', error: err.message });
    }
});

// Eliminar un producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al eliminar el producto del carrito', error: err.message });
    }
});

// Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // Espera un arreglo de productos en el cuerpo de la solicitud

    try {
        const updatedCart = await cartManager.updateCartProducts(cid, products);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Error al actualizar los productos del carrito', error: err.message });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Validar que la cantidad sea mayor a 0
    if (!quantity || quantity <= 0) {
        return res.status(400).json({ status: 'error', message: 'La cantidad debe ser mayor a 0' });
    }

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ status: 'success', cart: updatedCart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

export default router;