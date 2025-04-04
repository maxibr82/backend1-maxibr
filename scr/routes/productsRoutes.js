import express from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = express.Router();
const productManager = new ProductManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;