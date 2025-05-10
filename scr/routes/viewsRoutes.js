import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Ruta raíz
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('home', { products });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('realTimeProducts', { products });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para visualizar un carrito por ID
router.get('/cart/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        res.render('cart', { cart });
    } catch (err) {
        res.status(500).send('Error al cargar el carrito');
    }
});

// Ruta para visualizar todos los carritos
router.get('/carts', async (req, res) => {
    try {
        const carts = await Cart.find().populate('products.product'); // Consultar la colección 'carts'
        res.render('carts', { carts }); // Renderizar la vista 'carts.handlebars'
    } catch (err) {
        console.error('Error al cargar los carritos:', err);
        res.status(500).send('Error al cargar los carritos');
    }
});

export default router;