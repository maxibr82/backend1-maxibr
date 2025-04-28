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

router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        req.app.get('io').emit('productAdded', newProduct); // Emitir evento WebSocket
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.id, req.body);
        res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
    } catch (err) {
        if (err.message === 'Producto no encontrado') {
            res.status(404).json({ error: err.message });
        } else if (err.message.startsWith('El campo')) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        req.app.get('io').emit('productDeleted', deletedProduct); // Emitir evento WebSocket
        res.json({ message: 'Producto eliminado correctamente', product: deletedProduct });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;