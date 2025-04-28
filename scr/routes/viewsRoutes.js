import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

// Ruta raíz
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para productos en tiempo real
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

export default router;