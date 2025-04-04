const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager();

router.post('/', async (req, res) => {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
    if (!updatedCart) return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    res.status(201).json(updatedCart);
});

module.exports = router;