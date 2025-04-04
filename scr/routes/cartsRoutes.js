import express from 'express';
import CartManager from '../managers/CartManager.js';

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart.products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
        res.status(201).json(updatedCart);
    } catch (err) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router;